import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { parse } from 'url';
import { PlayerService } from './player.service';

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceType: 'computer' | 'smartphone' | 'tablet' | 'unknown';
  isPlaybackActive: boolean;
  lastSeen: number;
}

interface ConnectedDevice extends DeviceInfo {
  ws: WebSocket;
}

@Injectable()
export class PlayerGatewayService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PlayerGatewayService.name);
  private wss: WebSocketServer | null = null;

  // Map: userId -> (Map: deviceId -> ConnectedDevice)
  private readonly userDevices = new Map<string, Map<string, ConnectedDevice>>();
  // Map: userId -> latest broadcast state
  private readonly userStates = new Map<string, any>();

  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly playerService: PlayerService,
  ) {}

  onModuleInit() {
    const server = this.adapterHost.httpAdapter.getHttpServer();
    if (!server) {
      this.logger.warn('HTTP server not available for WebSocket mounting');
      return;
    }

    this.wss = new WebSocketServer({ noServer: true });

    server.on('upgrade', (req: IncomingMessage, socket: any, head: Buffer) => {
      const { pathname, query } = parse(req.url || '', true);

      if (pathname !== '/api/player/connect') {
        return;
      }

      const onSocketError = (err: any) => {
        this.logger.debug(`Socket error during upgrade: ${err?.message}`);
      };
      socket.on('error', onSocketError);

      const token = (query.token as string) || '';
      const deviceId = (query.deviceId as string) || '';
      const deviceName = (query.deviceName as string) || 'Sonicly Player';
      const deviceType = (query.deviceType as any) || 'computer';

      if (!token || !deviceId) {
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
          'sonicly_jwt_secret_change_in_production',
        );
        const decoded = this.jwtService.verify(token, { secret });
        const userId = decoded.sub;

        this.wss?.handleUpgrade(req, socket, head, (ws) => {
          socket.removeListener('error', onSocketError);
          try {
            this.handleConnection(ws, userId, deviceId, deviceName, deviceType);
          } catch (err) {
            this.logger.debug(`Connection handling error for ${deviceId}: ${err?.message}`);
          }
        });
      } catch (err) {
        socket.removeListener('error', onSocketError);
        this.logger.debug(`WebSocket auth rejected: ${err.message}`);
        try {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
        } catch {}
      }
    });

    this.logger.log('Player WebSocket Gateway mounted at /api/player/connect');
  }

  onModuleDestroy() {
    this.wss?.close();
  }

  private safeSend(ws: WebSocket, payload: string) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(payload, (err) => {
        if (err) {
          this.logger.debug(`Failed to send WS message: ${err?.message}`);
        }
      });
    }
  }

  private handleConnection(
    ws: WebSocket,
    userId: string,
    deviceId: string,
    deviceName: string,
    deviceType: 'computer' | 'smartphone' | 'tablet' | 'unknown',
  ) {
    // Attach error listener IMMEDIATELY before any operations to prevent uncaughtException crash
    ws.on('error', (err) => {
      this.logger.debug(`WS error on ${deviceId}: ${err?.message}`);
    });

    if (!this.userDevices.has(userId)) {
      this.userDevices.set(userId, new Map());
    }

    const devices = this.userDevices.get(userId)!;

    // Check if any currently connected device is already active
    const hasActive = Array.from(devices.values()).some((d) => d.isPlaybackActive);
    const isPlaybackActive = !hasActive;

    const deviceRecord: ConnectedDevice = {
      ws,
      deviceId,
      deviceName,
      deviceType,
      isPlaybackActive,
      lastSeen: Date.now(),
    };

    // Register device synchronously
    devices.set(deviceId, deviceRecord);
    this.logger.log(`Device connected: ${deviceName} (${deviceId}) for user ${userId}`);

    // Register message and close listeners synchronously
    ws.on('message', (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString());
        this.handleMessage(userId, deviceId, msg).catch((err) => {
          this.logger.debug(`Error handling message from ${deviceId}: ${err?.message}`);
        });
      } catch (err) {
        this.logger.debug(`Invalid WS payload from ${deviceId}: ${err.message}`);
      }
    });

    ws.on('close', async () => {
      try {
        devices.delete(deviceId);
        if (devices.size === 0) {
          this.userDevices.delete(userId);
        } else {
          // If the active device disconnected, promote another device if available
          if (deviceRecord.isPlaybackActive) {
            const remaining = Array.from(devices.values());
            if (remaining.length > 0) {
              remaining[0].isPlaybackActive = true;
              await this.playerService.updateState(userId, { activeDeviceId: remaining[0].deviceId }).catch(() => {});
            }
          }
        }
        this.broadcastDeviceList(userId);
        this.logger.log(`Device disconnected: ${deviceName} (${deviceId})`);
      } catch (err) {
        this.logger.debug(`Error in ws close handler: ${err?.message}`);
      }
    });

    // Broadcast updated device list to all user's devices immediately
    this.broadcastDeviceList(userId);

    // If there is existing playback state, immediately seed the connecting device
    if (this.userStates.has(userId)) {
      const activeDev = Array.from(devices.values()).find((d) => d.isPlaybackActive);
      this.safeSend(
        ws,
        JSON.stringify({
          type: 'REMOTE_STATE_SYNC',
          state: this.userStates.get(userId),
          activeDeviceId: activeDev?.deviceId || null,
        }),
      );
    }

    // Check DB state asynchronously in background without blocking message flow
    this.playerService.getState(userId).then(async (dbState) => {
      if (!devices.has(deviceId)) return;
      if (dbState?.activeDeviceId && devices.has(dbState.activeDeviceId)) {
        let changed = false;
        for (const [id, dev] of devices.entries()) {
          const shouldBeActive = id === dbState.activeDeviceId;
          if (dev.isPlaybackActive !== shouldBeActive) {
            dev.isPlaybackActive = shouldBeActive;
            changed = true;
          }
        }
        if (changed) {
          this.broadcastDeviceList(userId);
        }
      } else if (isPlaybackActive) {
        await this.playerService.updateState(userId, { activeDeviceId: deviceId }).catch(() => {});
      }
    }).catch(() => {});
  }

  private async handleMessage(userId: string, senderDeviceId: string, msg: any) {
    this.logger.log(`[WS] ${senderDeviceId} sent ${msg?.type}: ${JSON.stringify(msg)}`);
    const devices = this.userDevices.get(userId);
    if (!devices) return;

    const senderDevice = devices.get(senderDeviceId);
    if (senderDevice) {
      senderDevice.lastSeen = Date.now();
    }

    switch (msg?.type) {
      case 'PING': {
        if (senderDevice) {
          this.safeSend(senderDevice.ws, JSON.stringify({ type: 'PONG' }));
        }
        break;
      }

      case 'TRANSFER_PLAYBACK': {
        const targetDeviceId = msg.targetDeviceId;
        if (!targetDeviceId || !devices.has(targetDeviceId)) return;

        // Set target as active, all others as inactive
        for (const [id, dev] of devices.entries()) {
          const shouldBeActive = id === targetDeviceId;
          dev.isPlaybackActive = shouldBeActive;
          if (shouldBeActive) {
            // Tell target device to take over audio playback
            this.safeSend(dev.ws, JSON.stringify({ type: 'TAKE_OVER_PLAYBACK' }));
          } else {
            // Tell other devices to pause audio output
            this.safeSend(dev.ws, JSON.stringify({ type: 'YIELD_PLAYBACK' }));
          }
        }

        // Persist active device
        await this.playerService.updateState(userId, { activeDeviceId: targetDeviceId }).catch(() => {});
        this.broadcastDeviceList(userId);
        break;
      }

      case 'REMOTE_COMMAND': {
        // Forward command to the active device
        const activeDevice = Array.from(devices.values()).find((d) => d.isPlaybackActive);
        if (activeDevice && activeDevice.deviceId !== senderDeviceId) {
          this.safeSend(
            activeDevice.ws,
            JSON.stringify({
              type: 'EXECUTE_COMMAND',
              command: msg.command,
              payload: msg.payload,
              senderDeviceId,
            }),
          );
        }
        break;
      }

      case 'STATE_BROADCAST': {
        const sender = devices.get(senderDeviceId);
        if (sender) {
          // If the sender is playing, it automatically holds active playback status
          if (msg.state?.isPlaying) {
            let activeChanged = false;
            for (const [id, dev] of devices.entries()) {
              const shouldBeActive = id === senderDeviceId;
              if (dev.isPlaybackActive !== shouldBeActive) {
                dev.isPlaybackActive = shouldBeActive;
                activeChanged = true;
              }
            }
            if (activeChanged) {
              this.broadcastDeviceList(userId);
              this.playerService.updateState(userId, { activeDeviceId: senderDeviceId }).catch(() => {});
            }
          }
          this.userStates.set(userId, msg.state);

          const payload = JSON.stringify({
            type: 'REMOTE_STATE_SYNC',
            state: msg.state,
            activeDeviceId: senderDeviceId,
          });

          for (const [id, dev] of devices.entries()) {
            if (id !== senderDeviceId) {
              this.safeSend(dev.ws, payload);
            }
          }
        }
        break;
      }
    }
  }

  private broadcastDeviceList(userId: string) {
    const devices = this.userDevices.get(userId);
    if (!devices) return;

    const deviceList: DeviceInfo[] = Array.from(devices.values()).map((d) => ({
      deviceId: d.deviceId,
      deviceName: d.deviceName,
      deviceType: d.deviceType,
      isPlaybackActive: d.isPlaybackActive,
      lastSeen: d.lastSeen,
    }));

    const activeDeviceId = deviceList.find((d) => d.isPlaybackActive)?.deviceId || null;

    const payload = JSON.stringify({
      type: 'DEVICES_UPDATED',
      devices: deviceList,
      activeDeviceId,
    });

    for (const dev of devices.values()) {
      this.safeSend(dev.ws, payload);
    }
  }
}
