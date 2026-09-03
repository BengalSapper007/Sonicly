import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const SIDEBAR_MIN_WIDTH = 68;
export const SIDEBAR_DEFAULT_WIDTH = 232;
export const SIDEBAR_MIN_EXPANDED_WIDTH = 180;
export const SIDEBAR_MAX_WIDTH = 420;
export const SIDEBAR_COLLAPSE_THRESHOLD = 120;

interface SidebarState {
  width: number;
  isCollapsed: boolean;
  isDragging: boolean;
  lastExpandedWidth: number;
  setDragWidth: (width: number) => void;
  finishDrag: () => void;
  setIsDragging: (isDragging: boolean) => void;
  collapse: () => void;
  expand: (targetWidth?: number) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      width: SIDEBAR_DEFAULT_WIDTH,
      isCollapsed: false,
      isDragging: false,
      lastExpandedWidth: SIDEBAR_DEFAULT_WIDTH,

      setDragWidth: (rawWidth: number) => {
        const clampedWidth = Math.min(
          Math.max(rawWidth, SIDEBAR_MIN_WIDTH),
          SIDEBAR_MAX_WIDTH
        );
        const isCollapsed = clampedWidth < SIDEBAR_COLLAPSE_THRESHOLD;
        set({
          width: clampedWidth,
          isCollapsed,
          ...(isCollapsed ? {} : { lastExpandedWidth: Math.max(clampedWidth, SIDEBAR_MIN_EXPANDED_WIDTH) }),
        });
      },

      finishDrag: () => {
        const currentWidth = get().width;
        if (currentWidth < SIDEBAR_COLLAPSE_THRESHOLD) {
          set({
            width: SIDEBAR_MIN_WIDTH,
            isCollapsed: true,
            isDragging: false,
          });
        } else if (currentWidth < SIDEBAR_MIN_EXPANDED_WIDTH) {
          set({
            width: SIDEBAR_MIN_EXPANDED_WIDTH,
            isCollapsed: false,
            lastExpandedWidth: SIDEBAR_MIN_EXPANDED_WIDTH,
            isDragging: false,
          });
        } else {
          set({
            isCollapsed: false,
            lastExpandedWidth: currentWidth,
            isDragging: false,
          });
        }
      },

      setIsDragging: (isDragging: boolean) => {
        set({ isDragging });
      },

      collapse: () => {
        set({
          width: SIDEBAR_MIN_WIDTH,
          isCollapsed: true,
        });
      },

      expand: (targetWidth?: number) => {
        const target = targetWidth ?? get().lastExpandedWidth ?? SIDEBAR_DEFAULT_WIDTH;
        set({
          width: Math.min(Math.max(target, SIDEBAR_MIN_EXPANDED_WIDTH), SIDEBAR_MAX_WIDTH),
          isCollapsed: false,
        });
      },
    }),
    {
      name: 'sonicly-sidebar-state',
      partialize: (state) => ({
        width: state.width,
        isCollapsed: state.isCollapsed,
        lastExpandedWidth: state.lastExpandedWidth,
      }),
    }
  )
);
