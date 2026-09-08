'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useDeviceStore } from '@/stores/device.store';
import { usePlayerStore } from '@/stores/player.store';
import { toast } from '@/stores/toast.store';

let _socketInstance: WebSocket | null = null;

export function sendSocketMessage(msg: any): boolean {
  if (_socketInstance && _socketInstance.readyState === WebSocket.OPEN) {
    _socketInstance.send(JSON.stringify(msg));
    return true;
  }
  return false;
}

export function transferPlaybackTo(targetDeviceId: string) {
  useDeviceStore.getState().setActiveDeviceId(targetDeviceId);
  sendSocketMessage({
    type: 'TRANSFER_PLAYBACK',
    targetDeviceId,
  });
}

export function claimActivePlayback() {
  const { myDeviceId, activeDeviceId } = useDeviceStore.getState();
  if (activeDeviceId !== myDeviceId) {
    useDeviceStore.getState().setActiveDeviceId(myDeviceId);
    sendSocketMessage({
      type: 'TRANSFER_PLAYBACK',
      targetDeviceId: myDeviceId,
    });
  }
}

export function sendRemotePlayerCommand(command: string, payload?: any) {
  sendSocketMessage({
    type: 'REMOTE_COMMAND',
    command,
    payload,
  });
}

export function broadcastLocalPlaybackState(override?: Partial<{
  currentTime: number;
  duration: number;
  progress: number;
  isPlaying: boolean;
  currentSong: any;
}>) {
  const player = usePlayerStore.getState();
  const currentSong = override?.currentSong !== undefined ? override.currentSong : player.currentSong;
  const currentTime = override?.currentTime !== undefined ? override.currentTime : player.currentTime;
  const duration = override?.duration !== undefined ? override.duration : player.duration;
  const progress = override?.progress !== undefined ? override.progress : player.progress;
  const isPlaying = override?.isPlaying !== undefined ? override.isPlaying : player.isPlaying;

  sendSocketMessage({
    type: 'STATE_BROADCAST',
    state: {
      currentSong,
      currentTime,
      duration,
      progress,
      isPlaying,
      queue: player.queue,
      userQueue: player.userQueue,
      currentIndex: player.currentIndex,
      contextType: player.contextType,
      contextId: player.contextId,
      contextTitle: player.contextTitle,
      shuffle: player.shuffle,
      repeat: player.repeat,
    },
  });
}

export function useDeviceSocket() {
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { myDeviceId, myDeviceName, myDeviceType, setDevices } = useDeviceStore();
  const socketRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<any>(null);

  const connect = useCallback(() => {
    if (!isAuthenticated || !token || typeof window === 'undefined') return;

    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch {}
    }

    const host = window.location.hostname || 'localhost';
    const wsUrl = `ws://${host}:3001/api/player/connect?token=${encodeURIComponent(
      token,
    )}&deviceId=${encodeURIComponent(myDeviceId)}&deviceName=${encodeURIComponent(
      myDeviceName,
    )}&deviceType=${encodeURIComponent(myDeviceType)}`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;
    _socketInstance = ws;

    ws.onopen = () => {
      // Start ping heartbeat
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'PING' }));
        }
      }, 25000);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
          case 'DEVICES_UPDATED': {
            setDevices(msg.devices, msg.activeDeviceId);
            break;
          }

          case 'TAKE_OVER_PLAYBACK': {
            toast.info('Listening on this device');
            const player = usePlayerStore.getState();
            player.resume();
            break;
          }

          case 'YIELD_PLAYBACK': {
            const player = usePlayerStore.getState();
            player.pause();
            toast.info('Playback transferred to another device');
            break;
          }

          case 'EXECUTE_COMMAND': {
            const player = usePlayerStore.getState();
            const { command, payload } = msg;
            switch (command) {
              case 'TOGGLE_PLAY':
                player.togglePlay();
                break;
              case 'PAUSE':
                player.pause();
                break;
              case 'RESUME':
                player.resume();
                break;
              case 'NEXT':
                player.next();
                break;
              case 'PREV':
                player.prev();
                break;
              case 'SEEK':
                if (payload?.progress !== undefined) {
                  player.seek(payload.progress);
                }
                break;
              case 'SET_VOLUME':
                if (payload?.volume !== undefined) {
                  player.setVolume(payload.volume);
                }
                break;
            }
            break;
          }

          case 'REMOTE_STATE_SYNC': {
            // Received state updates from the active remote device
            const { myDeviceId } = useDeviceStore.getState();
            const activeDevId = msg.activeDeviceId || useDeviceStore.getState().activeDeviceId;

            if (activeDevId && activeDevId !== myDeviceId && msg.state) {
              if (activeDevId !== useDeviceStore.getState().activeDeviceId) {
                useDeviceStore.getState().setActiveDeviceId(activeDevId);
              }

              const update: any = {
                currentTime: msg.state.currentTime,
                duration: msg.state.duration,
                progress: msg.state.progress,
                isPlaying: msg.state.isPlaying,
              };

              if (msg.state.currentSong !== undefined) {
                update.currentSong = msg.state.currentSong;
              }
              if (Array.isArray(msg.state.queue)) {
                update.queue = msg.state.queue;
              }
              if (Array.isArray(msg.state.userQueue)) {
                update.userQueue = msg.state.userQueue;
              }
              if (msg.state.currentIndex !== undefined) {
                update.currentIndex = msg.state.currentIndex;
              }
              if (msg.state.contextType !== undefined) {
                update.contextType = msg.state.contextType;
              }
              if (msg.state.contextId !== undefined) {
                update.contextId = msg.state.contextId;
              }
              if (msg.state.contextTitle !== undefined) {
                update.contextTitle = msg.state.contextTitle;
              }
              if (msg.state.shuffle !== undefined) {
                update.shuffle = msg.state.shuffle;
              }
              if (msg.state.repeat !== undefined) {
                update.repeat = msg.state.repeat;
              }

              usePlayerStore.setState(update);
            }
            break;
          }
        }
      } catch {}
    };

    ws.onclose = () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (_socketInstance === ws) {
        _socketInstance = null;
      }
    };

    ws.onerror = () => {
      try {
        ws.close();
      } catch {}
    };
  }, [isAuthenticated, token, myDeviceId, myDeviceName, myDeviceType, setDevices]);

  useEffect(() => {
    connect();

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch {}
        socketRef.current = null;
      }
      _socketInstance = null;
    };
  }, [connect]);
}
