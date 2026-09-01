'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeOffIcon, LoaderIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center px-4 py-16">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-glow opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl mx-auto mb-4 relative" style={{ boxShadow: '0 0 30px rgba(232, 114, 12, 0.35)' }}>
            <img src="/logo-icon.png" alt="Sonicly" className="w-full h-full object-cover scale-110" />
          </div>
          <h1 className="font-display font-bold text-2xl text-on-surface">Welcome back</h1>
          <p className="text-on-surface-muted text-sm mt-1">Sign in to your Sonicly account</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border-light rounded-2xl p-6 shadow-elevated">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-on-surface-muted mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-surface border border-border-light rounded-lg px-4 py-2.5 text-on-surface text-sm
                  placeholder-ink-ghost focus:outline-none focus:border-sonic focus:ring-1 focus:ring-sonic/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface-muted mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-surface border border-border-light rounded-lg px-4 py-2.5 pr-10 text-on-surface text-sm
                    placeholder-ink-ghost focus:outline-none focus:border-sonic focus:ring-1 focus:ring-sonic/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted/60 hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-sonic hover:bg-sonic-light text-white font-semibold text-sm
                transition-all shadow-sonic hover:shadow-glow-sm disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isLoading ? <LoaderIcon size={16} className="animate-spin" /> : null}
              Sign in
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-on-surface-muted mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-vibrant-saffron hover:text-deep-saffron transition-colors font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
