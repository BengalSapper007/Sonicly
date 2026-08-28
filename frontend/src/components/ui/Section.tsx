'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SectionProps {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, href, icon, children, className }: SectionProps) {
  return (
    <section className={cn('py-4', className)}>
      <div className="flex items-center justify-between mb-4 border-l-4 border-vibrant-saffron pl-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-headline-md text-headline-md font-bold text-prussian-blue">{title}</h2>
        </div>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-xs font-bold text-prussian-blue hover:text-vibrant-saffron transition-colors group"
          >
            See all
            <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
