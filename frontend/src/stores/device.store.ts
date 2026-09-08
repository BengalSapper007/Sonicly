import { create } from 'zustand';

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceType: 'computer' | 'smartphone' | 'tablet' | 'unknown';
  isPlaybackActive: boolean;
  lastSeen: number;
}

interface DeviceState {
  myDeviceId: string;
  myDeviceName: string;
  myDeviceType: 'computer' | 'smartphone' | 'tablet' | 'unknown';
  availableDevices: DeviceInfo[];
  activeDeviceId: string | null;
  isDevicePickerOpen: boolean;

  setDevices: (devices: DeviceInfo[], activeDeviceId: string | null) => void;
  setActiveDeviceId: (activeDeviceId: string | null) => void;
  setDevicePickerOpen: (open: boolean) => void;
  toggleDevicePicker: () => void;
}

function detectDevice(): {
  id: string;
  name: string;
  type: 'computer' | 'smartphone' | 'tablet' | 'unknown';
} {
  if (typeof window === 'undefined') {
    return { id: 'srv', name: 'Web Player', type: 'computer' };
  }

  // Generate or retrieve persistent session device ID
  let id = sessionStorage.getItem('sonicly_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36).slice(-4);
    try {
      sessionStorage.setItem('sonicly_device_id', id);
    } catch {}
  }

  const ua = navigator.userAgent;
  let type: 'computer' | 'smartphone' | 'tablet' | 'unknown' = 'computer';
  let os = 'Web Player';

  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    type = 'tablet';
    os = 'Tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle/i.test(ua)) {
    type = 'smartphone';
    if (/iPhone|iPod/i.test(ua)) os = 'iPhone';
    else if (/Android/i.test(ua)) os = 'Android Phone';
    else os = 'Mobile';
  } else {
    type = 'computer';
    if (/Win/i.test(ua)) os = 'Windows PC';
    else if (/Mac/i.test(ua)) os = 'Mac';
    else if (/Linux/i.test(ua)) os = 'Linux PC';
  }

  // Detect Browser
  let browser = 'Browser';
  if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Chrome/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';

  const name = `${os} (${browser})`;
  return { id, name, type };
}

const detected = detectDevice();

export const useDeviceStore = create<DeviceState>((set) => ({
  myDeviceId: detected.id,
  myDeviceName: detected.name,
  myDeviceType: detected.type,
  availableDevices: [],
  activeDeviceId: null,
  isDevicePickerOpen: false,

  setDevices: (availableDevices, activeDeviceId) =>
    set({ availableDevices, activeDeviceId }),

  setActiveDeviceId: (activeDeviceId) => set({ activeDeviceId }),

  setDevicePickerOpen: (isDevicePickerOpen) => set({ isDevicePickerOpen }),
  toggleDevicePicker: () => set((s) => ({ isDevicePickerOpen: !s.isDevicePickerOpen })),
}));
