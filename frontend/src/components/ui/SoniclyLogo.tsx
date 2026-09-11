import { cn } from '@/lib/utils';

interface SoniclyLogoProps {
  size?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
}

export function SoniclyLogo({
  size = 32,
  className,
  priority = false,
  alt = 'Sonicly',
}: SoniclyLogoProps) {
  return (
    <img
      src="/logo.svg"
      alt={alt}
      width={size}
      height={size}
      className={cn('select-none object-contain flex-shrink-0', className)}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
