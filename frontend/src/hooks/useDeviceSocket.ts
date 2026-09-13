'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useDeviceStore } from '@/stores/device.store';
import { usePlayerStore, isSongLoading, getAudioElement } from '@/stores/player.store';
import { toast } from '@/stores/toast.store';

let _socketInstance: WebSocket | null = null;

export function sendSocketMessage(msg: any): boolean {
  if (_socketInstance && _socketInstance.readyState === WebSocket.OPEN) {
    try {
      _socketInstance.send(JSON.stringify(msg));
      return true;
    } catch {}
  }
  return false;
}

/**
 * Determine the appropriate WebSocket endpoint for the player gateway.
 * - Prioritizes NEXT_PUBLIC_WS_URL (e.g. wss://backend.domain.com)
 * - Derives from NEXT_PUBLIC_API_URL if available
 * - Enforces wss:// if the current page is served over https:// to prevent Mixed Content SecurityErrors
 */
function getWebSocketUrl(
  token: string,
  myDeviceId: string,
  myDeviceName: string,
  myDeviceType: string,
): string | null {
  if (typeof window === 'undefined') return null;

  const isHttps = window.location.protocol === 'https:';

  // 1. Explicit WS URL environment variable
  let baseWsUrl = process.env.NEXT_PUBLIC_WS_URL?.trim();

  // 2. Derive from NEXT_PUBLIC_API_URL if available
  if (!baseWsUrl && process.env.NEXT_PUBLIC_API_URL) {
    const rawApi = process.env.NEXT_PUBLIC_API_URL.trim();
    if (rawApi.startsWith('http://') || rawApi.startsWith('https://')) {
      try {
        const urlObj = new URL(rawApi);
        const wsProtocol = urlObj.protocol === 'https:' ? 'wss:' : 'ws:';
        baseWsUrl = `${wsProtocol}//${urlObj.host}`;
      } catch {}
    }
  }

  // 3. Fallback for localhost vs deployed
  if (!baseWsUrl) {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      baseWsUrl = `ws://${host}:3001`;
    } else {
      // In production, fallback to current host
      baseWsUrl = `${isHttps ? 'wss:' : 'ws:'}//${window.location.host}`;
    }
  }

  // Strip trailing slashes and any /api suffix
  baseWsUrl = baseWsUrl.replace(/\/+$/, '').replace(/\/api\/?$/, '');

  // Normalize http(s) schemes to ws(s) if an HTTP/HTTPS URL was provided
  if (baseWsUrl.startsWith('https://')) {
    baseWsUrl = baseWsUrl.replace(/^https:\/\//, 'wss://');
  } else if (baseWsUrl.startsWith('http://')) {
    baseWsUrl = baseWsUrl.replace(/^http:\/\//, 'ws://');
  }

  // Crucial security constraint: NEVER use insecure ws:// from an https:// origin
  if (isHttps && baseWsUrl.startsWith('ws://')) {
    baseWsUrl = baseWsUrl.replace(/^ws:\/\//, 'wss://');
  }

  return `${baseWsUrl}/api/player/connect?token=${encodeURIComponent(
    token,
  )}&deviceId=${encodeURIComponent(myDeviceId)}&deviceName=${encodeURIComponent(
    myDeviceName,
  )}&deviceType=${encodeURIComponent(myDeviceType)}`;
}

export function transferPlaybackTo(targetDeviceId: string) {
  const { myDeviceId, activeDeviceId } = useDeviceStore.getState();
  if (activeDeviceId === targetDeviceId) return;
  useDeviceStore.getState().setIsTransferring(targetDeviceId);
  useDeviceStore.getState().setActiveDeviceId(targetDeviceId);
  sendSocketMessage({
    type: 'TRANSFER_PLAYBACK',
    targetDeviceId,
  });

  // If taking over playback on THIS device and playback was active, start loading/resuming immediately in this user gesture
  if (targetDeviceId === myDeviceId) {
    const player = usePlayerStore.getState();
    if (player.isPlaying && player.currentSong) {
      player.resume();
    }
  }
}

export function claimActivePlayback() {
  const { myDeviceId, activeDeviceId } = useDeviceStore.getState();
  if (!myDeviceId || activeDeviceId === myDeviceId) return;
  useDeviceStore.getState().setActiveDeviceId(myDeviceId);
  sendSocketMessage({
    type: 'TRANSFER_PLAYBACK',
    targetDeviceId: myDeviceId,
  });
}

export function sendRemotePlayerCommand(command: string, payload?: any, targetDeviceId?: string) {
  const target = targetDeviceId || useDeviceStore.getState().activeDeviceId;
  sendSocketMessage({
    type: 'REMOTE_COMMAND',
    command,
    payload,
    targetDeviceId: target,
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

  const socketRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const reconnectAttemptsRef = useRef(0);
  const isMountedRef = useRef(true);
  const isIntentionalCloseRef = useRef(false);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;
    const currentToken = useAuthStore.getState().token;
    const currentAuth = useAuthStore.getState().isAuthenticated;

    if (!currentAuth || !currentToken) {
      if (socketRef.current) {
        isIntentionalCloseRef.current = true;
        try {
          socketRef.current.close();
        } catch {}
        socketRef.current = null;
        _socketInstance = null;
      }
      return;
    }

    // Do NOT clobber if already open or in the middle of connecting
    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN ||
        socketRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    const { myDeviceId, myDeviceName, myDeviceType } = useDeviceStore.getState();

    let ws: WebSocket;
    try {
      const wsUrl = getWebSocketUrl(currentToken, myDeviceId, myDeviceName, myDeviceType);
      if (!wsUrl) return;

      isIntentionalCloseRef.current = false;
      ws = new WebSocket(wsUrl);
      socketRef.current = ws;
      _socketInstance = ws;
    } catch (err) {
      console.warn('[DeviceSocket] WebSocket connection could not be initiated:', err);
      return;
    }

    ws.onopen = () => {
      reconnectAttemptsRef.current = 0;
      useDeviceStore.getState().setIsConnected(true);

      // Start ping heartbeat
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          try {
            ws.send(JSON.stringify({ type: 'PING' }));
          } catch {}
        }
      }, 25000);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
          case 'DEVICES_UPDATED': {
            useDeviceStore.getState().setDevices(msg.devices, msg.activeDeviceId);
            useDeviceStore.getState().setIsTransferring(null);
            const { myDeviceId } = useDeviceStore.getState();
            // If another device is active, make sure this device is not continuing to play local audio
            if (msg.activeDeviceId && msg.activeDeviceId !== myDeviceId) {
              const audio = getAudioElement();
              if (audio && !audio.paused) {
                audio.pause();
              }
            }
            break;
          }

          case 'TAKE_OVER_PLAYBACK': {
            useDeviceStore.getState().setIsTransferring(null);
            toast.info('Listening on this device');
            const player = usePlayerStore.getState();
            const audio = getAudioElement();
            const isAudioActive = (audio && !audio.paused) || isSongLoading();
            // Only resume if playback was playing and local audio is not already actively playing/loading
            if (player.isPlaying && !isAudioActive) {
              player.resume();
            }
            break;
          }

          case 'YIELD_PLAYBACK': {
            useDeviceStore.getState().setIsTransferring(null);
            if (msg.newActiveDeviceId) {
              useDeviceStore.getState().setActiveDeviceId(msg.newActiveDeviceId);
            }
            // Silence local audio output without dispatching a remote PAUSE command to the new active device
            const audio = getAudioElement();
            if (audio && !audio.paused) {
              audio.pause();
            }
            toast.info('Playback transferred to another device');
            break;
          }

          case 'EXECUTE_COMMAND': {
            const player = usePlayerStore.getState();
            const { command, payload } = msg;
            switch (command) {
              case 'PLAY_SONG':
                if (payload?.song) {
                  player.playSong(
                    payload.song,
                    payload.queue,
                    payload.contextType,
                    payload.contextId,
                    payload.contextTitle
                  );
                }
                break;
              case 'PLAY_QUEUE':
                if (payload?.songs) {
                  player.playQueue(
                    payload.songs,
                    payload.startIndex ?? 0,
                    payload.contextType,
                    payload.contextId,
                    payload.contextTitle
                  );
                }
                break;
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
              case 'SET_SHUFFLE':
                if (payload?.shuffle !== undefined) {
                  usePlayerStore.setState({ shuffle: payload.shuffle });
                  broadcastLocalPlaybackState();
                }
                break;
              case 'SET_REPEAT':
                if (payload?.repeat !== undefined) {
                  usePlayerStore.setState({ repeat: payload.repeat });
                  broadcastLocalPlaybackState();
                }
                break;
              case 'PLAY_NEXT':
                if (payload?.songs) {
                  player.playNext(payload.songs);
                  broadcastLocalPlaybackState();
                }
                break;
              case 'ADD_TO_QUEUE':
                if (payload?.songs) {
                  player.addToQueue(payload.songs);
                  broadcastLocalPlaybackState();
                }
                break;
              case 'REMOVE_FROM_USER_QUEUE':
                if (payload?.index !== undefined) {
                  player.removeFromUserQueue(payload.index);
                  broadcastLocalPlaybackState();
                }
                break;
              case 'REMOVE_FROM_CONTEXT_QUEUE':
                if (payload?.index !== undefined) {
                  player.removeFromContextQueue(payload.index);
                  broadcastLocalPlaybackState();
                }
                break;
              case 'CLEAR_USER_QUEUE':
                player.clearUserQueue();
                broadcastLocalPlaybackState();
                break;
              case 'CLEAR_CONTEXT_QUEUE':
                player.clearContextQueue();
                broadcastLocalPlaybackState();
                break;
              case 'CLEAR_ALL_UPCOMING':
                player.clearAllUpcoming();
                broadcastLocalPlaybackState();
                break;
              case 'REORDER_USER_QUEUE':
                if (payload?.fromIndex !== undefined && payload?.toIndex !== undefined) {
                  player.reorderUserQueue(payload.fromIndex, payload.toIndex);
                  broadcastLocalPlaybackState();
                }
                break;
              case 'REORDER_CONTEXT_QUEUE':
                if (payload?.fromIndex !== undefined && payload?.toIndex !== undefined) {
                  player.reorderContextQueue(payload.fromIndex, payload.toIndex);
                  broadcastLocalPlaybackState();
                }
                break;
              case 'PLAY_FROM_USER_QUEUE':
                if (payload?.index !== undefined) {
                  player.playFromUserQueue(payload.index);
                }
                break;
              case 'PLAY_FROM_CONTEXT_QUEUE':
                if (payload?.index !== undefined) {
                  player.playFromContextQueue(payload.index);
                }
                break;
            }
            break;
          }

          case 'REMOTE_STATE_SYNC': {
            // Received state updates from the active remote device
            const { myDeviceId, activeDeviceId } = useDeviceStore.getState();
            const activeDevId = msg.activeDeviceId || activeDeviceId;

            // If THIS device is currently active, ignore remote state broadcasts
            if (activeDeviceId === myDeviceId) {
              break;
            }

            // If another device is active, ensure local audio element is not producing sound
            const audio = getAudioElement();
            if (audio && !audio.paused) {
              audio.pause();
            }

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
      useDeviceStore.getState().setIsConnected(false);
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (_socketInstance === ws) {
        _socketInstance = null;
      }
      if (socketRef.current === ws) {
        socketRef.current = null;
      }

      // Only auto-reconnect if close was UNINTENTIONAL and user is still logged in
      if (!isIntentionalCloseRef.current && isMountedRef.current && useAuthStore.getState().isAuthenticated) {
        const delay = Math.min(1000 * Math.pow(1.5, reconnectAttemptsRef.current), 10000);
        reconnectAttemptsRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current && useAuthStore.getState().isAuthenticated) {
            connect();
          }
        }, delay);
      }
    };

    ws.onerror = () => {
      try {
        ws.close();
      } catch {}
    };
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    isIntentionalCloseRef.current = false;

    if (isAuthenticated && token) {
      connect();
    } else {
      if (socketRef.current) {
        isIntentionalCloseRef.current = true;
        try {
          socketRef.current.close();
        } catch {}
        socketRef.current = null;
        _socketInstance = null;
      }
      useDeviceStore.getState().setIsConnected(false);
    }

    const handleOnline = () => {
      if (socketRef.current?.readyState !== WebSocket.OPEN && socketRef.current?.readyState !== WebSocket.CONNECTING) {
        reconnectAttemptsRef.current = 0;
        connect();
      }
    };

    const handleVisibility = () => {
      if (
        document.visibilityState === 'visible' &&
        socketRef.current?.readyState !== WebSocket.OPEN &&
        socketRef.current?.readyState !== WebSocket.CONNECTING
      ) {
        connect();
      }
    };

    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isMountedRef.current = false;
      isIntentionalCloseRef.current = true;
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch {}
        socketRef.current = null;
      }
      _socketInstance = null;
    };
  }, [isAuthenticated, token, connect]);
}
