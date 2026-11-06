import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { parse } from 'url';
import { JamService } from './jam.service';
import { PrismaService } from '../prisma/prisma.service';

export interface JamConnectedClient {
  ws: WebSocket;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  deviceId: string;
  jamCode: string;
  isHost: boolean;
  lastPing: number;
}

@Injectable()
export class JamGatewayService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(JamGatewayService.name);
  private wss: WebSocketServer | null = null;

  // Map: jamCode -> Map: (userId + ':' + deviceId) -> JamConnectedClient
  private readonly roomClients = new Map<string, Map<string, JamConnectedClient>>();

  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly jamService: JamService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    const server = this.adapterHost.httpAdapter.getHttpServer();
    if (!server) {
      this.logger.warn('HTTP server not available for Jam WebSocket mounting');
      return;
    }

    this.wss = new WebSocketServer({ noServer: true });

    server.on('upgrade', (req: IncomingMessage, socket: any, head: Buffer) => {
      const { pathname, query } = parse(req.url || '', true);

      if (pathname !== '/api/jam/connect') {
        return;
      }

      const onSocketError = (err: any) => {
        this.logger.debug(`Socket error during Jam upgrade: ${err?.message}`);
      };
      socket.on('error', onSocketError);

      const token = (query.token as string) || '';
      const jamCode = ((query.jamCode as string) || '').toUpperCase();
      const deviceId = (query.deviceId as string) || `device_${Date.now()}`;

      if (!token || !jamCode) {
        socket.removeListener('error', onSocketError);
        try {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
        } catch {}
        return;
      }

      try {
        const secret = this.configService.get<string>(
          'JWT_SECRET',
          'sonicly_jwt_super_secret_key_change_in_production_2026',
        );
        const decoded = this.jwtService.verify(token, { secret });
        const userId = decoded.sub;

        this.wss?.handleUpgrade(req, socket, head, async (ws) => {
          socket.removeListener('error', onSocketError);
          try {
            await this.handleConnection(ws, userId, jamCode, deviceId);
          } catch (err: any) {
            this.logger.error(`Error in Jam connection handler: ${err?.message}`);
            ws.close(1011, 'Internal Jam error');
          }
        });
      } catch (err: any) {
        socket.removeListener('error', onSocketError);
        this.logger.debug(`Jam WS auth rejected: ${err?.message}`);
        try {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
        } catch {}
      }
    });

    this.logger.log('Jam WebSocket Gateway mounted at /api/jam/connect');
  }

  onModuleDestroy() {
    this.wss?.close();
  }

  private safeSend(ws: WebSocket, payload: string) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(payload, (err) => {
        if (err) {
          this.logger.debug(`Failed to send Jam WS message: ${err?.message}`);
        }
      });
    }
  }

  private async handleConnection(
    ws: WebSocket,
    userId: string,
    jamCode: string,
    deviceId: string,
  ) {
    ws.on('error', (err) => {
      this.logger.debug(`Jam WS error on ${deviceId}: ${err?.message}`);
    });

    // Verify jam existence and user access
    let jam: any;
    try {
      jam = await this.jamService.getJamByCode(jamCode);
    } catch {
      ws.close(4004, 'Jam session not found');
      return;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, displayName: true, imageUrl: true },
    });

    if (!user) {
      ws.close(4001, 'User not found');
      return;
    }

    // Ensure user is enrolled as participant in DB
    await this.jamService.joinJam(userId, jamCode);

    if (!this.roomClients.has(jamCode)) {
      this.roomClients.set(jamCode, new Map());
    }

    const room = this.roomClients.get(jamCode)!;
    const clientKey = `${userId}:${deviceId}`;
    const isHost = jam.hostId === userId;

    const client: JamConnectedClient = {
      ws,
      userId,
      userName: user.displayName || user.username,
      userAvatar: user.imageUrl,
      deviceId,
      jamCode,
      isHost,
      lastPing: Date.now(),
    };

    room.set(clientKey, client);
    this.logger.log(`[Jam:${jamCode}] ${client.userName} (${userId}) connected on ${deviceId}`);

    // Welcome message with current state
    this.safeSend(
      ws,
      JSON.stringify({
        type: 'JAM_INIT_STATE',
        jam,
        isHost,
        serverTimestamp: Date.now(),
      }),
    );

    // Notify room of participant list update
    this.broadcastParticipants(jamCode);

    ws.on('message', (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString());
        this.handleMessage(client, msg).catch((err) => {
          this.logger.debug(`Error handling Jam WS message: ${err?.message}`);
        });
      } catch (err: any) {
        this.logger.debug(`Invalid Jam WS JSON: ${err?.message}`);
      }
    });

    ws.on('close', async () => {
      room.delete(clientKey);
      this.logger.log(`[Jam:${jamCode}] ${client.userName} disconnected`);

      // Check if user still has other devices connected in room
      const userHasOtherDevice = Array.from(room.values()).some((c) => c.userId === userId);
      if (!userHasOtherDevice) {
        // If host left completely, check room
        if (client.isHost) {
          const remainingClients = Array.from(room.values());
          if (remainingClients.length > 0) {
            const nextHost = remainingClients[0];
            nextHost.isHost = true;
            await this.prisma.jamSession.update({
              where: { id: jam.id },
              data: { hostId: nextHost.userId },
            });
            this.broadcastToRoom(jamCode, {
              type: 'HOST_CHANGED',
              newHostId: nextHost.userId,
              newHostName: nextHost.userName,
            });
          }
        }
      }

      if (room.size === 0) {
        this.roomClients.delete(jamCode);
      } else {
        this.broadcastParticipants(jamCode);
      }
    });
  }

  private async handleMessage(sender: JamConnectedClient, msg: any) {
    sender.lastPing = Date.now();
    const jamCode = sender.jamCode;

    switch (msg?.type) {
      case 'SYNC_PING': {
        this.safeSend(
          sender.ws,
          JSON.stringify({
            type: 'SYNC_PONG',
            clientTimestamp: msg.clientTimestamp,
            serverTimestamp: Date.now(),
          }),
        );
        break;
      }

      case 'PLAYBACK_ACTION': {
        // msg: { type: 'PLAYBACK_ACTION', action: 'PLAY'|'PAUSE'|'SEEK'|'NEXT', payload: { songId, positionMs, ... } }
        const jam = await this.jamService.getJamByCode(jamCode).catch(() => null);
        if (!jam) return;

        // If host-only, reject actions from non-hosts
        if (jam.hostControlsOnly && jam.hostId !== sender.userId) {
          this.safeSend(
            sender.ws,
            JSON.stringify({
              type: 'ACTION_REJECTED',
              reason: 'Only the host can control playback in this Jam.',
            }),
          );
          return;
        }

        // Persist playback updates asynchronously
        if (msg.action === 'SEEK' || msg.action === 'PLAY' || msg.action === 'PAUSE') {
          await this.jamService.updateJam(sender.userId, jamCode, {
            currentPositionMs: msg.payload?.positionMs,
            isPlaying: msg.action === 'PLAY' ? true : msg.action === 'PAUSE' ? false : undefined,
            currentSongId: msg.payload?.songId,
          }).catch(() => {});
        } else if (msg.action === 'NEXT') {
          const nextSong = await this.jamService.popNextQueueSong(jamCode).catch(() => null);
          if (nextSong) {
            msg.payload = { ...msg.payload, song: nextSong, songId: nextSong.id, positionMs: 0 };
          }
        }

        // Broadcast to all participants in the room
        this.broadcastToRoom(jamCode, {
          type: 'REMOTE_PLAYBACK_ACTION',
          action: msg.action,
          payload: msg.payload,
          serverTimestamp: Date.now(),
          initiatedBy: {
            userId: sender.userId,
            userName: sender.userName,
          },
        });
        break;
      }

      case 'HOST_STATE_SYNC': {
        // Periodic broadcast from host to keep everybody in line
        if (!sender.isHost) return;
        this.broadcastToRoom(
          jamCode,
          {
            type: 'REMOTE_STATE_SYNC',
            state: msg.state,
            serverTimestamp: Date.now(),
          },
          sender.deviceId, // exclude sender
        );
        break;
      }

      case 'QUEUE_UPDATED': {
        // Fetch fresh queue and broadcast to all
        const jam = await this.jamService.getJamByCode(jamCode).catch(() => null);
        if (jam) {
          this.broadcastToRoom(jamCode, {
            type: 'REMOTE_QUEUE_UPDATED',
            queueItems: jam.queueItems,
          });
        }
        break;
      }

      case 'CHAT_REACTION': {
        // Fun live emoji reactions (🔥, ❤️, 🎉, 🎵, 👏)
        this.broadcastToRoom(jamCode, {
          type: 'CHAT_REACTION',
          emoji: msg.emoji || '🎵',
          user: {
            id: sender.userId,
            name: sender.userName,
            avatar: sender.userAvatar,
          },
        });
        break;
      }
    }
  }

  private broadcastToRoom(jamCode: string, payload: any, excludeDeviceId?: string) {
    const room = this.roomClients.get(jamCode);
    if (!room) return;

    const message = JSON.stringify(payload);
    for (const client of room.values()) {
      if (excludeDeviceId && client.deviceId === excludeDeviceId) continue;
      this.safeSend(client.ws, message);
    }
  }

  private async broadcastParticipants(jamCode: string) {
    const room = this.roomClients.get(jamCode);
    if (!room) return;

    // Deduplicate participants by userId for display
    const uniqueMap = new Map<string, { userId: string; userName: string; userAvatar?: string | null; isHost: boolean }>();
    for (const c of room.values()) {
      if (!uniqueMap.has(c.userId)) {
        uniqueMap.set(c.userId, {
          userId: c.userId,
          userName: c.userName,
          userAvatar: c.userAvatar,
          isHost: c.isHost,
        });
      }
    }

    const participants = Array.from(uniqueMap.values());
    this.broadcastToRoom(jamCode, {
      type: 'PARTICIPANTS_UPDATED',
      participants,
    });
  }
}

