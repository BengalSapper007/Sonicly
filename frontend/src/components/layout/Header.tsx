'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export function Header() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header
      className="flex-shrink-0 flex items-center gap-4 px-4 md:px-8"
      style={{ height: 'var(--header-height)', background: '#F6F1E4' }}
    >
      {/* Logo — mobile only; desktop already has it in the sidebar */}
      <Link href="/" className="md:hidden flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center text-white font-bold text-sm">
          S
        </div>
      </Link>

      {/* Search — desktop only; mobile uses the Search tab instead */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-md hidden md:block">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search artists, songs, albums…"
          className="w-full bg-paper border border-sand focus:border-saffron rounded-full py-2 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted outline-none transition-colors"
        />
      </form>

      <div className="flex-1 md:hidden" />

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 ml-auto">
        {isAuthenticated && (
          <button className="p-2 rounded-full text-ink-muted hover:text-ink hover:bg-sand/50 transition-colors" title="Notifications">
            <Bell className="w-5 h-5" />
          </button>
        )}

        {isAuthenticated ? (
          <Link
            href="/library"
            className="w-9 h-9 rounded-full bg-indigo text-white flex items-center justify-center font-semibold text-sm flex-shrink-0"
          >
            {user?.displayName?.[0]?.toUpperCase() || 'U'}
          </Link>
        ) : (
          <Link href="/login" className="btn-primary text-sm px-4 py-2">
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}
