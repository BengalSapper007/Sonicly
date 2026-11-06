'use client';
import { useJamStore } from '@/stores/jam.store';

export function JamFloatingReactions() {
  const reactions = useJamStore((s) => s.reactions);

  if (reactions.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-8 z-40 pointer-events-none flex flex-col items-end gap-2 overflow-hidden">
      {reactions.map((r) => (
        <div
          key={r.id}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-xl animate-fade-in-up"
        >
          <span className="text-xl animate-bounce">{r.emoji}</span>
          <span className="text-xs font-medium text-neutral-300">{r.user.name}</span>
        </div>
      ))}
    </div>
  );
}

