'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useJamStore } from '@/stores/jam.store';
import { jamApi } from '@/lib/api';
import { toast } from '@/stores/toast.store';
import { Radio, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function JoinJamPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params?.code as string)?.toUpperCase();
  const { user, token } = useAuthStore();
  const { setJamSession } = useJamStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    if (!token) {
      // Need login first
      router.push(`/login?redirect=/jam/${code}`);
      return;
    }

    let isMounted = true;

    async function join() {
      try {
        setLoading(true);
        const res = await jamApi.joinJam(code);
        if (isMounted) {
          setJamSession(res.data, res.data.hostId === user?.id);
          toast.success(`Connected to ${res.data.host?.displayName || 'Host'}'s Jam!`);
          router.push('/');
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Jam session not found or has expired.');
          setLoading(false);
        }
      }
    }

    join();

    return () => {
      isMounted = false;
    };
  }, [code, token, router, setJamSession, user?.id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c1122] p-4 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#12192F] p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E2720A]/10 text-[#E2720A] border border-[#E2720A]/30 mb-4 shadow-lg shadow-orange-500/10">
          <Radio className="h-7 w-7 animate-pulse" />
        </div>

        <h1 className="text-xl font-bold tracking-tight">Joining Jam</h1>
        <p className="text-sm font-mono tracking-widest text-[#E2720A] mt-1">{code}</p>

        {loading ? (
          <div className="mt-6 flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
            <p className="text-xs text-neutral-400">Syncing with room participants...</p>
          </div>
        ) : error ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
              {error}
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition"
            >
              Back to Sonicly <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

