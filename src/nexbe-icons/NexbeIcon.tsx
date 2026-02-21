'use client';

import { isNexbiIcon } from './icon-registry';
import type { NexbeIconProps, NexbeIconVariant, NexbiVariant } from './types';

// ─── Variant → Tailwind color class mapping ────────────────────────

const VARIANT_CLASS: Record<NexbeIconVariant, string> = {
  flame:   'text-nexbe-flame',
  light:   'text-nexbe-text',
  dark:    'text-nexbe-deep',
  muted:   'text-nexbe-text-muted',
  inherit: '',
};

// ─── Helpers ───────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

function getNexbiSrc(name: string, variant: NexbiVariant): string {
  const suffix = variant === 'default' ? '' : `-${variant}`;
  return `/icons/nexbi/icon-${name}${suffix}.svg`;
}

// ─── Component ─────────────────────────────────────────────────────

/**
 * Unified NEXBE brand icon component.
 *
 * For **line icons**: renders inline SVG via sprite `<use>`.
 * Color is controlled by the `variant` prop (maps to CSS text-color).
 *
 * For **NEXBi mini icons**: renders `<img>` with the correct variant file.
 * Use `nexbiVariant` to select: 'default' | 'light' | 'outlined'.
 *
 * @example
 * <NexbeIcon name="magazyn-energii" size={32} variant="flame" />
 * <NexbeIcon name="nexbi-ok" size={48} nexbiVariant="light" />
 */
export function NexbeIcon({
  name,
  size = 24,
  className,
  variant = 'flame',
  nexbiVariant = 'default',
  style,
  ...rest
}: NexbeIconProps) {
  const ariaLabel = rest['aria-label'];

  if (isNexbiIcon(name)) {
    // NEXBi mini icon — render as <img>
    return (
      <img
        src={getNexbiSrc(name, nexbiVariant)}
        alt={ariaLabel || ''}
        width={size}
        height={size}
        className={cn('inline-block flex-shrink-0', className)}
        style={style}
        loading="lazy"
        decoding="async"
      />
    );
  }

  // Line icon — render via sprite <use> with CSS color control
  const colorClass = VARIANT_CLASS[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('inline-block flex-shrink-0', colorClass, className)}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <use href={`/icons/sprite.svg#icon-${name}`} />
    </svg>
  );
}

export default NexbeIcon;
