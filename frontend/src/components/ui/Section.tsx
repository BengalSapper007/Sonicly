'use client';
import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react';
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
    <section className={cn('px-8 py-5', className)}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-display font-semibold text-lg text-on-surface">{title}</h2>
        </div>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-sm text-on-surface-muted hover:text-vibrant-saffron transition-colors group"
          >
            See all
            <ChevronRightIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
