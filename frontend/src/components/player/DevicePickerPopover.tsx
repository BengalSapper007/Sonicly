'use client';
import { useEffect, useRef } from 'react';
import { useDeviceStore, DeviceInfo } from '@/stores/device.store';
import { transferPlaybackTo } from '@/hooks/useDeviceSocket';
import { Laptop, Smartphone, Tablet, MonitorSpeaker, Check, Radio } from 'lucide-react';

function getDeviceIcon(type: string, className = 'w-5 h-5') {
  switch (type) {
    case 'smartphone':
      return <Smartphone className={className} />;
    case 'tablet':
      return <Tablet className={className} />;
    case 'computer':
    default:
      return <Laptop className={className} />;
  }
}

export function DevicePickerPopover() {
  const {
    myDeviceId,
    availableDevices,
    activeDeviceId,
    isDevicePickerOpen,
    setDevicePickerOpen,
  } = useDeviceStore();

  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isDevicePickerOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setDevicePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDevicePickerOpen, setDevicePickerOpen]);

  if (!isDevicePickerOpen) return null;

  const activeDevice = availableDevices.find((d) => d.deviceId === activeDeviceId);
  const isPlayingLocally = activeDeviceId === myDeviceId;

  return (
    <div
      ref={popoverRef}
      className="absolute bottom-full mb-3 right-4 md:right-16 w-80 max-w-[calc(100vw-2rem)] rounded-xl bg-[#17203A] border border-white/10 shadow-2xl z-50 overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150"
      style={{ backdropFilter: 'blur(16px)' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MonitorSpeaker className="w-5 h-5 text-crisp-green" />
          <h3 className="font-semibold text-sm">Connect to a device</h3>
        </div>
        {activeDevice && (
          <span className="flex items-center gap-1.5 text-xs text-crisp-green font-medium">
            <span className="w-2 h-2 rounded-full bg-crisp-green animate-pulse" />
            Active
          </span>
        )}
      </div>

      {/* Device List */}
      <div className="p-2 max-h-72 overflow-y-auto divide-y divide-white/5">
        {availableDevices.length === 0 ? (
          <div className="p-4 text-center text-xs text-on-primary-muted">
            Connecting to devices...
          </div>
        ) : (
          availableDevices.map((device) => {
            const isActive = device.deviceId === activeDeviceId;
            const isThisDevice = device.deviceId === myDeviceId;

            return (
              <button
                key={device.deviceId}
                onClick={() => {
                  if (!isActive) {
                    transferPlaybackTo(device.deviceId);
                  }
                  setDevicePickerOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-crisp-green/15 text-crisp-green'
                    : 'hover:bg-white/5 text-on-primary hover:text-white'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isActive ? 'bg-crisp-green/20 text-crisp-green' : 'bg-white/5 text-on-primary-muted'
                  }`}
                >
                  {getDeviceIcon(device.deviceType)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm truncate">{device.deviceName}</span>
                    {isThisDevice && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono">
                        This device
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-on-primary-muted mt-0.5">
                    {isActive ? (
                      <span className="text-crisp-green flex items-center gap-1">
                        <Radio className="w-3 h-3 animate-pulse" />
                        Listening here
                      </span>
                    ) : (
                      'Tap to switch audio here'
                    )}
                  </div>
                </div>

                {isActive && <Check className="w-4 h-4 text-crisp-green flex-shrink-0" />}
              </button>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-black/20 border-t border-white/5 text-[11px] text-on-primary-muted leading-relaxed">
        {availableDevices.length <= 1 ? (
          <span>
            💡 Open Sonicly on your phone or another computer to use remote playback control.
          </span>
        ) : (
          <span>
            🎧 Audio streams directly to the active device. Other devices act as real-time remotes.
          </span>
        )}
      </div>
    </div>
  );
}
