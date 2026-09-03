'use client';
import { useToastStore } from '@/stores/toast.store';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-24 md:bottom-28 right-4 md:right-8 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-xl border border-white/10 text-white text-sm backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{
            background:
              t.type === 'error'
                ? '#7F1D1D'
                : t.type === 'info'
                ? '#1B2447'
                : '#0F6B45', // Forest green for success
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {t.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-300 flex-shrink-0" />
            ) : t.type === 'info' ? (
              <Info className="w-4 h-4 text-amber-300 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            )}
            <span className="truncate font-medium">{t.message}</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {t.action && (
              <button
                onClick={() => {
                  t.action?.onClick();
                  removeToast(t.id);
                }}
                className="px-2 py-0.5 text-xs font-bold rounded bg-white/20 hover:bg-white/30 transition-colors"
              >
                {t.action.label}
              </button>
            )}
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 text-white/60 hover:text-white transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
