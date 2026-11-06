'use client';
import { useJamStore } from '@/stores/jam.store';
import { Radio, Users } from 'lucide-react';

export function JamPill() {
  const { isInJam, participants, hostName, isHost, openModal } = useJamStore();

  if (!isInJam) {
    return (
      <button
        onClick={openModal}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/10 transition"
        title="Start or join a Jam"
      >
        <Radio className="h-4 w-4 text-[#E2720A]" />
        <span className="hidden sm:inline">Jam</span>
      </button>
    );
  }

  const listenerCount = participants.length;

  return (
    <button
      onClick={openModal}
      className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition shadow-sm"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="truncate max-w-[120px] sm:max-w-[160px]">
        {isHost ? `Your Jam (${listenerCount})` : `Jam with ${hostName || 'Host'}`}
      </span>
      <Users className="h-3 w-3 opacity-70" />
    </button>
  );
}

