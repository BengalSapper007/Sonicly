'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useJamStore } from '@/stores/jam.store';
import { usePlayerStore, getAudioElement } from '@/stores/player.store';
import { useDeviceStore } from '@/stores/device.store';
import { toast } from '@/stores/toast.store';

let _jamSocket: WebSocket | null = null;
let _clockOffset = 0; // ms difference: serverTime - clientTime

export function sendJamMessage(msg: any): boolean {
  if (_jamSocket && _jamSocket.readyState === WebSocket.OPEN) {
    try {
      _jamSocket.send(JSON.stringify(msg));
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function broadcastJamAction(action: 'PLAY' | 'PAUSE' | 'SEEK' | 'NEXT', payload?: any) {
  const { isInJam, hostControlsOnly, isHost } = useJamStore.getState();
  if (!isInJam) return;
  if (hostControlsOnly && !isHost) {
    toast.error('Only the host can control playback in this Jam.');
    return;
  }
  sendJamMessage({
    type: 'PLAYBACK_ACTION',
    action,
    payload: {
      ...payload,
      timestamp: Date.now(),
    },
  });
}

export function sendJamReaction(emoji: string) {
  sendJamMessage({
    type: 'CHAT_REACTION',
    emoji,
  });
}

export function notifyJamQueueUpdated() {
  sendJamMessage({
    type: 'QUEUE_UPDATED',
  });
}

export function useJamSocket() {
  const { token, user } = useAuthStore();
  const { jamCode, isInJam, isHost, setParticipants, setJamQueue, setHost, addReaction, leaveJam } = useJamStore();
  const myDeviceId = useDeviceStore((s) => s.myDeviceId);

  const pingIntervalRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const driftIntervalRef = useRef<any>(null);

  // Measure network latency and calculate server clock offset
  const sendSyncPing = useCallback(() => {
    if (_jamSocket && _jamSocket.readyState === WebSocket.OPEN) {
      sendJamMessage({
        type: 'SYNC_PING',
        clientTimestamp: Date.now(),
      });
    }
  }, []);

  useEffect(() => {
    if (!isInJam || !jamCode || !token) {
      if (_jamSocket) {
        _jamSocket.close();
        _jamSocket = null;
      }
      return;
    }

    let isUnmounted = false;

    const connect = () => {
      if (isUnmounted) return;

      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      let wsBase = process.env.NEXT_PUBLIC_WS_URL?.trim();

      if (!wsBase && process.env.NEXT_PUBLIC_API_URL) {
        const rawApi = process.env.NEXT_PUBLIC_API_URL.trim();
        try {
          const u = new URL(rawApi);
          wsBase = `${u.protocol === 'https:' ? 'wss:' : 'ws:'}//${u.host}`;
        } catch {}
      }

      if (!wsBase) {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        wsBase = host === 'localhost' || host === '127.0.0.1' ? 'ws://localhost:3001' : `${isHttps ? 'wss:' : 'ws:'}//${window.location.host}`;
      }

      wsBase = wsBase.replace(/\/+$/, '').replace(/\/api\/?$/, '');
      if (isHttps && wsBase.startsWith('ws://')) {
        wsBase = wsBase.replace(/^ws:\/\//, 'wss://');
      }

      const url = `${wsBase}/api/jam/connect?token=${encodeURIComponent(token)}&jamCode=${encodeURIComponent(jamCode)}&deviceId=${encodeURIComponent(myDeviceId || 'web')}`;

      const ws = new WebSocket(url);
      _jamSocket = ws;

      ws.onopen = () => {
        sendSyncPing();
        // Ping clock offset every 10 seconds
        pingIntervalRef.current = setInterval(sendSyncPing, 10_000);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          switch (msg.type) {
            case 'SYNC_PONG': {
              const now = Date.now();
              const rtt = now - msg.clientTimestamp;
              const estimatedServerNow = msg.serverTimestamp + rtt / 2;
              const measuredOffset = estimatedServerNow - now;
              // Smooth moving average
              _clockOffset = _clockOffset === 0 ? measuredOffset : _clockOffset * 0.7 + measuredOffset * 0.3;
              break;
            }

            case 'PARTICIPANTS_UPDATED': {
              if (msg.participants) {
                setParticipants(msg.participants);
              }
              break;
            }

            case 'HOST_CHANGED': {
              setHost(msg.newHostId, msg.newHostName);
              toast.info(`${msg.newHostName} is now the host of this Jam.`);
              break;
            }

            case 'REMOTE_QUEUE_UPDATED': {
              if (msg.queueItems) {
                setJamQueue(msg.queueItems);
              }
              break;
            }

            case 'CHAT_REACTION': {
              addReaction(msg.emoji, msg.user);
              break;
            }

            case 'ACTION_REJECTED': {
              toast.error(msg.reason || 'Action rejected');
              break;
            }

            case 'REMOTE_PLAYBACK_ACTION': {
              const { action, payload, serverTimestamp, initiatedBy } = msg;
              const audio = getAudioElement();
              const player = usePlayerStore.getState();

              // Calculate expected timestamp
              const now = Date.now();
              const estimatedServerTimeAtMsg = serverTimestamp;
              const currentServerTime = now + _clockOffset;
              const elapsedMs = Math.max(0, currentServerTime - estimatedServerTimeAtMsg);
              const targetPositionSec = Math.max(0, ((payload?.positionMs ?? 0) + elapsedMs) / 1000);

              if (action === 'PLAY') {
                if (payload?.song && (!player.currentSong || player.currentSong.id !== payload.song.id)) {
                  player.playSong(payload.song, undefined, null, null, null, { skipRemoteBroadcast: true });
                }
                if (audio) {
                  audio.currentTime = targetPositionSec;
                  audio.play().catch(() => {});
                }
                player.setIsPlaying(true);
                if (initiatedBy?.userName && initiatedBy.userId !== user?.id) {
                  toast.info(`${initiatedBy.userName} resumed playback`);
                }
              } else if (action === 'PAUSE') {
                if (audio) {
                  audio.pause();
                  if (payload?.positionMs !== undefined) {
                    audio.currentTime = payload.positionMs / 1000;
                  }
                }
                player.setIsPlaying(false);
                if (initiatedBy?.userName && initiatedBy.userId !== user?.id) {
                  toast.info(`${initiatedBy.userName} paused playback`);
                }
              } else if (action === 'SEEK') {
                if (audio && payload?.positionMs !== undefined) {
                  audio.currentTime = payload.positionMs / 1000;
                }
              } else if (action === 'NEXT') {
                if (payload?.song) {
                  player.playSong(payload.song, undefined, null, null, null, { skipRemoteBroadcast: true });
                  if (audio) {
                    audio.currentTime = 0;
                    audio.play().catch(() => {});
                  }
                  if (initiatedBy?.userName && initiatedBy.userId !== user?.id) {
                    toast.info(`${initiatedBy.userName} skipped to ${payload.song.title}`);
                  }
                }
              }
              break;
            }

            case 'REMOTE_STATE_SYNC': {
              // Drift correction on periodic sync from host
              const { state, serverTimestamp } = msg;
              const audio = getAudioElement();
              if (!audio || !state) return;

              const now = Date.now();
              const currentServerTime = now + _clockOffset;
              const elapsedMs = Math.max(0, currentServerTime - serverTimestamp);
              const expectedPositionSec = Math.max(0, (state.positionMs + elapsedMs) / 1000);
              const driftSec = Math.abs(audio.currentTime - expectedPositionSec);

              if (driftSec > 0.8) {
                // Hard seek if drift is > 800ms
                audio.currentTime = expectedPositionSec;
                audio.playbackRate = 1.0;
              } else if (driftSec > 0.08) {
                // Micro-adjust playback speed silently
                const isLagging = audio.currentTime < expectedPositionSec;
                audio.playbackRate = isLagging ? 1.025 : 0.975;
              } else {
                audio.playbackRate = 1.0;
              }
              break;
            }
          }
        } catch {}
      };

      ws.onclose = (e) => {
        clearInterval(pingIntervalRef.current);
        _jamSocket = null;
        if (!isUnmounted && e.code !== 4004 && e.code !== 4001) {
          // Reconnect after 3s
          reconnectTimeoutRef.current = setTimeout(connect, 3000);
        } else if (e.code === 4004) {
          toast.error('Jam session has ended');
          leaveJam();
        }
      };
    };

    connect();

    return () => {
      isUnmounted = true;
      clearInterval(pingIntervalRef.current);
      clearInterval(driftIntervalRef.current);
      clearTimeout(reconnectTimeoutRef.current);
      if (_jamSocket) {
        _jamSocket.close();
        _jamSocket = null;
      }
    };
  }, [isInJam, jamCode, token, myDeviceId, setParticipants, setJamQueue, setHost, addReaction, leaveJam, user?.id, sendSyncPing]);

  // If this client is host, periodically broadcast state to room
  useEffect(() => {
    if (!isInJam || !isHost) return;

    const interval = setInterval(() => {
      const audio = getAudioElement();
      const currentSong = usePlayerStore.getState().currentSong;
      const isPlaying = usePlayerStore.getState().isPlaying;

      if (audio && currentSong && isPlaying) {
        sendJamMessage({
          type: 'HOST_STATE_SYNC',
          state: {
            songId: currentSong.id,
            positionMs: Math.round(audio.currentTime * 1000),
            isPlaying,
          },
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isInJam, isHost]);
}
