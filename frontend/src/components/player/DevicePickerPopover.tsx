'use client';
import { useEffect, useRef, useState } from 'react';
import { useDeviceStore } from '@/stores/device.store';
import { transferPlaybackTo } from '@/hooks/useDeviceSocket';
import {
  Laptop,
  Smartphone,
  Tablet,
  MonitorSpeaker,
  X,
  ExternalLink,
  Loader2,
  HelpCircle,
  Wifi,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';

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
    isTransferringToDeviceId,
    isConnected,
  } = useDeviceStore();

  const [activeHelpModal, setActiveHelpModal] = useState<'notFound' | 'whatCanConnect' | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside (desktop only)
  useEffect(() => {
    if (!isDevicePickerOpen) {
      setActiveHelpModal(null);
      return;
    }

    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        // Only close if we are not clicking a device toggle button
        const target = e.target as HTMLElement | null;
        if (target?.closest('[data-device-picker-toggle="true"]')) return;
        setDevicePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDevicePickerOpen, setDevicePickerOpen]);

  // Lock body scroll on mobile when sheet is open
  useEffect(() => {
    if (isDevicePickerOpen && typeof window !== 'undefined' && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isDevicePickerOpen]);

  if (!isDevicePickerOpen) return null;

  // Ensure current device is present in list even if offline/connecting
  const displayDevices = availableDevices.length > 0 ? availableDevices : [
    {
      deviceId: myDeviceId,
      deviceName: 'This web browser',
      deviceType: 'computer' as const,
      isPlaybackActive: true,
      lastSeen: Date.now(),
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay (< md) */}
      <div
        onClick={() => setDevicePickerOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Popover / Mobile Bottom Sheet Container */}
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        aria-label="Connect to a device"
        className={`
          fixed md:absolute z-50 overflow-hidden text-white shadow-2xl transition-all
          /* Mobile styles: Bottom Sheet */
          inset-x-0 bottom-0 md:inset-auto md:bottom-full md:mb-3 md:right-4 md:right-16
          w-full md:w-84 max-w-full md:max-w-[340px]
          rounded-t-3xl md:rounded-2xl
          bg-[#121624] border border-white/10
          animate-in slide-in-from-bottom-5 md:slide-in-from-bottom-2 md:fade-in duration-200
        `}
        style={{
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 1px 1px rgba(255,255,255,0.08)',
        }}
      >
        {/* Mobile drag handle */}
        <div className="md:hidden flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* ── Main View vs Help View ── */}
        {activeHelpModal === null ? (
          <div>
            {/* Header */}
            <div className="px-5 pt-3.5 pb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Connect
                {!isConnected && (
                  <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Connecting...
                  </span>
                )}
              </h2>
              <button
                onClick={() => setDevicePickerOpen(false)}
                className="p-1.5 rounded-full text-on-primary-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Device List */}
            <div className="px-3 pb-3 space-y-2 max-h-[60vh] md:max-h-72 overflow-y-auto">
              {displayDevices.map((device) => {
                const isActive = (device.deviceId === activeDeviceId) || (!activeDeviceId && device.deviceId === myDeviceId);
                const isThisDevice = device.deviceId === myDeviceId;
                const isTransferring = isTransferringToDeviceId === device.deviceId;
                const displayName = isThisDevice ? 'This web browser' : device.deviceName;

                return (
                  <button
                    key={device.deviceId}
                    disabled={isTransferring}
                    onClick={() => {
                      if (!isActive) {
                        transferPlaybackTo(device.deviceId);
                      }
                    }}
                    className={`w-full flex items-center gap-3.5 p-3 rounded-xl text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1D253A] border border-crisp-green/40 text-crisp-green shadow-sm'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/5'
                    }`}
                  >
                    {/* Device Icon */}
                    <div
                      className={`p-2.5 rounded-lg flex-shrink-0 transition-colors ${
                        isActive
                          ? 'bg-crisp-green/20 text-crisp-green'
                          : 'bg-white/5 text-on-primary-muted'
                      }`}
                    >
                      {getDeviceIcon(device.deviceType, 'w-5 h-5')}
                    </div>

                    {/* Device Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm truncate ${isActive ? 'text-crisp-green' : 'text-white'}`}>
                          {displayName}
                        </span>
                        {isThisDevice && !isActive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-on-primary-muted font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-on-primary-muted mt-0.5 truncate">
                        {isTransferring ? (
                          <span className="text-crisp-green flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Connecting...
                          </span>
                        ) : isActive ? (
                          <span className="text-crisp-green/90 font-medium">
                            Listening here
                          </span>
                        ) : (
                          'Tap to switch playback'
                        )}
                      </div>
                    </div>

                    {/* Active Equalizer animation or Transfer Spinner */}
                    {isTransferring ? (
                      <Loader2 className="w-4 h-4 text-crisp-green animate-spin flex-shrink-0" />
                    ) : isActive ? (
                      <div className="flex items-end gap-0.5 h-3 flex-shrink-0 pr-1" aria-label="Playing audio">
                        <span className="w-0.5 h-full rounded-full bg-crisp-green animate-pulse" />
                        <span className="w-0.5 h-2/3 rounded-full bg-crisp-green animate-pulse delay-75" />
                        <span className="w-0.5 h-full rounded-full bg-crisp-green animate-pulse delay-150" />
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Spotify-style Footer Links */}
            <div className="px-5 py-3.5 border-t border-white/5 bg-black/20 space-y-2.5 text-xs text-on-primary-muted">
              <button
                onClick={() => setActiveHelpModal('notFound')}
                className="w-full flex items-center justify-between hover:text-white transition-colors cursor-pointer group text-left"
              >
                <span className="font-medium">Don’t see your device?</span>
                <ExternalLink className="w-3.5 h-3.5 text-on-primary-muted group-hover:text-white transition-colors" />
              </button>
              <button
                onClick={() => setActiveHelpModal('whatCanConnect')}
                className="w-full flex items-center justify-between hover:text-white transition-colors cursor-pointer group text-left"
              >
                <span className="font-medium">What can I connect to?</span>
                <ExternalLink className="w-3.5 h-3.5 text-on-primary-muted group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        ) : (
          /* ── Subview: Help & Instructions ── */
          <div className="p-5 animate-in fade-in slide-in-from-right-3 duration-150">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setActiveHelpModal(null)}
                className="flex items-center gap-1.5 text-xs text-on-primary-muted hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => setDevicePickerOpen(false)}
                className="p-1 rounded-full text-on-primary-muted hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeHelpModal === 'notFound' ? (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-crisp-green font-semibold text-sm">
                  <Wifi className="w-4 h-4" />
                  <h3>Don&apos;t see your device?</h3>
                </div>
                <div className="space-y-2.5 text-xs text-on-primary-muted leading-relaxed">
                  <p>To connect a phone, tablet, or another computer:</p>
                  <ol className="list-decimal list-inside space-y-1.5 pl-1 text-white/90">
                    <li>Open <strong>Sonicly</strong> in the web browser on your other device.</li>
                    <li>Log into the <strong>same Sonicly account</strong>.</li>
                    <li>Your device will instantly pop up in this menu for seamless playback transfer!</li>
                  </ol>
                  <p className="text-[11px] pt-1 text-on-primary-muted/80">
                    Tip: You can use your mobile phone as a wireless remote while your computer or speaker plays the music.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-crisp-green font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <h3>What can I connect to?</h3>
                </div>
                <div className="space-y-2.5 text-xs text-on-primary-muted leading-relaxed">
                  <p>Sonicly Connect supports real-time audio synchronization across:</p>
                  <ul className="space-y-2 text-white/90">
                    <li className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-crisp-green" />
                      <span>Any Mac, Windows PC, or Linux browser</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-crisp-green" />
                      <span>Android phones and iPhones</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Tablet className="w-4 h-4 text-crisp-green" />
                      <span>iPads and Android tablets</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MonitorSpeaker className="w-4 h-4 text-crisp-green" />
                      <span>Bluetooth speakers paired to any connected device</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
