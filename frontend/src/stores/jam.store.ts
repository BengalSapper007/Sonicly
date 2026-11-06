import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface JamParticipant {
  userId: string;
  userName: string;
  userAvatar?: string | null;
  isHost: boolean;
}

export interface JamQueueItem {
  id: string;
  song: any;
  addedBy: {
    id: string;
    username: string;
    displayName?: string;
    imageUrl?: string | null;
  };
  order: number;
}

export interface JamReaction {
  id: string;
  emoji: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  timestamp: number;
}

interface JamState {
  jamCode: string | null;
  isInJam: boolean;
  isHost: boolean;
  hostId: string | null;
  hostName: string | null;
  hostControlsOnly: boolean;
  participants: JamParticipant[];
  jamQueue: JamQueueItem[];
  reactions: JamReaction[];
  isModalOpen: boolean;

  setJamSession: (jam: any, isHost: boolean) => void;
  leaveJam: () => void;
  setParticipants: (participants: JamParticipant[]) => void;
  setJamQueue: (jamQueue: JamQueueItem[]) => void;
  setHostControlsOnly: (val: boolean) => void;
  setHost: (hostId: string, hostName: string) => void;
  addReaction: (emoji: string, user: { id: string; name: string; avatar?: string | null }) => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useJamStore = create<JamState>()(
  persist(
    (set) => ({
      jamCode: null,
      isInJam: false,
      isHost: false,
      hostId: null,
      hostName: null,
      hostControlsOnly: false,
      participants: [],
      jamQueue: [],
      reactions: [],
      isModalOpen: false,

      setJamSession: (jam, isHost) =>
        set({
          jamCode: jam.code,
          isInJam: true,
          isHost,
          hostId: jam.hostId,
          hostName: jam.host?.displayName || jam.host?.username || 'Host',
          hostControlsOnly: jam.hostControlsOnly ?? false,
          participants: jam.participants?.map((p: any) => ({
            userId: p.userId,
            userName: p.user?.displayName || p.user?.username || 'Listener',
            userAvatar: p.user?.imageUrl,
            isHost: p.role === 'HOST',
          })) || [],
          jamQueue: jam.queueItems || [],
        }),

      leaveJam: () =>
        set({
          jamCode: null,
          isInJam: false,
          isHost: false,
          hostId: null,
          hostName: null,
          hostControlsOnly: false,
          participants: [],
          jamQueue: [],
          reactions: [],
        }),

      setParticipants: (participants) => set({ participants }),

      setJamQueue: (jamQueue) => set({ jamQueue }),

      setHostControlsOnly: (hostControlsOnly) => set({ hostControlsOnly }),

      setHost: (hostId, hostName) => set({ hostId, hostName }),

      addReaction: (emoji, user) =>
        set((state) => ({
          reactions: [
            ...state.reactions.slice(-15), // keep last 15 reactions
            {
              id: `${Date.now()}_${Math.random()}`,
              emoji,
              user,
              timestamp: Date.now(),
            },
          ],
        })),

      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),
    }),
    {
      name: 'sonicly-jam-storage',
      partialize: (state) => ({
        jamCode: state.jamCode,
        isInJam: state.isInJam,
        isHost: state.isHost,
        hostId: state.hostId,
        hostName: state.hostName,
        hostControlsOnly: state.hostControlsOnly,
      }),
    },
  ),
);

