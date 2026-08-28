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
    <div className="min-h-full flex items-center justify-center px-4 py-16 bg-background text-on-surface">
      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded bg-vibrant-saffron border-2 border-prussian-blue flex items-center justify-center text-prussian-blue font-black text-2xl mx-auto mb-3 hard-shadow shadow-prussian-blue">
            S
          </div>
          <h1 className="font-headline-md text-headline-md font-bold text-prussian-blue">
            Welcome back
          </h1>
          <p className="font-body-md text-xs text-outline mt-1 font-medium">
            Sign in to your Sonicly account
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface border-2 border-prussian-blue rounded-xl p-6 hard-shadow shadow-prussian-blue">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded bg-red-500/10 border-2 border-red-500/30 text-red-700 text-xs font-semibold animate-fade-in">
                {error}
              </div>
            )}

            <div>
              <label className="block font-label-md text-xs font-bold text-prussian-blue mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-white border-2 border-prussian-blue focus:border-vibrant-saffron rounded px-4 py-2.5 text-prussian-blue text-sm placeholder:text-outline-variant outline-none font-medium transition-colors"
              />
            </div>

            <div>
              <label className="block font-label-md text-xs font-bold text-prussian-blue mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white border-2 border-prussian-blue focus:border-vibrant-saffron rounded px-4 py-2.5 pr-10 text-prussian-blue text-sm placeholder:text-outline-variant outline-none font-medium transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-prussian-blue transition-colors"
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded bg-vibrant-saffron text-prussian-blue font-bold text-sm border-2 border-prussian-blue shadow-[3px_3px_0px_0px_rgba(0,49,83,1)] hover:bg-deep-saffron transition-all active:translate-y-0.5 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <LoaderIcon size={16} className="animate-spin" /> : null}
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center font-body-md text-xs text-outline mt-4 font-medium">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-prussian-blue hover:text-vibrant-saffron transition-colors font-bold underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
