'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeOffIcon, LoaderIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', displayName: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      router.push('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl mx-auto mb-4 relative" style={{ boxShadow: '0 0 30px rgba(232, 114, 12, 0.35)' }}>
            <img src="/logo-icon.png" alt="Sonicly" className="w-full h-full object-cover scale-110" />
          </div>
          <h1 className="font-display font-bold text-2xl text-on-surface">Create your account</h1>
          <p className="text-on-surface-muted text-sm mt-1">Start listening with Sonicly</p>
        </div>

        <div className="bg-surface border border-border-light rounded-2xl p-6 shadow-elevated">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                {error}
              </div>
            )}

            <FormField label="Display name" type="text" value={form.displayName}
              onChange={handleChange('displayName')} placeholder="Your name" required />

            <FormField label="Username" type="text" value={form.username}
              onChange={handleChange('username')} placeholder="@username" required />

            <FormField label="Email" type="email" value={form.email}
              onChange={handleChange('email')} placeholder="you@example.com" required />

            <div>
              <label className="block text-sm font-medium text-on-surface-muted mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="w-full bg-surface border border-border-light rounded-lg px-4 py-2.5 pr-10 text-on-surface text-sm
                    placeholder-ink-ghost focus:outline-none focus:border-sonic focus:ring-1 focus:ring-sonic/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted/60 hover:text-on-surface"
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-sonic hover:bg-sonic-light text-white font-semibold text-sm
                transition-all shadow-sonic hover:shadow-glow-sm disabled:opacity-60
                flex items-center justify-center gap-2"
            >
              {isLoading && <LoaderIcon size={16} className="animate-spin" />}
              Create account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-on-surface-muted mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-vibrant-saffron hover:text-deep-saffron transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function FormField({
  label, type, value, onChange, placeholder, required,
}: {
  label: string; type: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-on-surface-muted mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full bg-surface border border-border-light rounded-lg px-4 py-2.5 text-on-surface text-sm
          placeholder-ink-ghost focus:outline-none focus:border-sonic focus:ring-1 focus:ring-sonic/30 transition-all"
      />
    </div>
  );
}
