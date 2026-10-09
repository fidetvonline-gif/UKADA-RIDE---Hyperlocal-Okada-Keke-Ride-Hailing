import React from 'react';

export interface UkadaLogoProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Display mode */
  variant?: 'full' | 'icon' | 'badge';
  /** Optional custom subtitle / tagline */
  subtitle?: string;
  /** Custom additional className for the wrapper */
  className?: string;
  /** Whether the text should link to home or be purely visual */
  onClick?: () => void;
  /** Theme adjustment (dark background by default) */
  theme?: 'dark' | 'light';
}

/**
 * UkadaMarkIcon: Precision-engineered SVG emblem for UKADA.
 * Incorporates:
 * 1. Aerodynamic "U" geometry with forward kinetic angle.
 * 2. Twin mobility conduits evoking two-wheel motorcycle agility & three-wheel Keke stability.
 * 3. Central GPS apex beacon in Nigerian gold/amber.
 * 4. Obsidian carbon substrate with chamfered metallic borders.
 */
export const UkadaMarkIcon: React.FC<{
  size?: number | string;
  className?: string;
  idSuffix?: string;
}> = ({ size = 36, className = '', idSuffix = 'main' }) => {
  const bgGradId = `ukada-bg-grad-${idSuffix}`;
  const goldGradId = `ukada-gold-grad-${idSuffix}`;
  const goldAccentGradId = `ukada-gold-accent-${idSuffix}`;
  const borderGradId = `ukada-border-grad-${idSuffix}`;
  const glowFilterId = `ukada-glow-${idSuffix}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="UKADA Mobility Mark"
    >
      <defs>
        {/* Substrate obsidian gradient */}
        <linearGradient id={bgGradId} x1="6" y1="4" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Primary golden amber speed gradient */}
        <linearGradient id={goldGradId} x1="10" y1="10" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="25%" stopColor="#F59E0B" />
          <stop offset="75%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* Bright metallic edge gradient */}
        <linearGradient id={goldAccentGradId} x1="12" y1="8" x2="32" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Outer border gradient with high-end specular bevel */}
        <linearGradient id={borderGradId} x1="2" y1="2" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="35%" stopColor="#64748B" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#334155" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
        </linearGradient>

        {/* Subtle glow filter */}
        <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#F59E0B" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Outer Squircle Container with Chamfered Precision Curve */}
      <rect
        x="1.5"
        y="1.5"
        width="41"
        height="41"
        rx="10"
        fill={`url(#${bgGradId})`}
        stroke={`url(#${borderGradId})`}
        strokeWidth="1.5"
      />

      {/* Internal Substrate Precision Grid Lines (Automotive tech aesthetic) */}
      <path
        d="M22 6V12M22 32V38M6 22H12M32 22H38"
        stroke="#F59E0B"
        strokeOpacity="0.18"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* The Dynamic UKADA "U" Crest */}
      <g filter={`url(#${glowFilterId})`}>
        {/* Left Wing / Velocity Pillar */}
        <path
          d="M12.5 12C12.5 10.8954 13.3954 10 14.5 10H17.2C18.0837 10 18.8 10.7163 18.8 11.6V24.5C18.8 26.9853 20.8147 29 23.3 29H23.7C26.1853 29 28.2 26.9853 28.2 24.5V18.5C28.2 17.6163 28.9163 16.9 29.8 16.9H32.5C33.6046 16.9 34.5 17.7954 34.5 18.9V24.8C34.5 30.6542 29.7542 35.4 23.9 35.4H23.1C17.2458 35.4 12.5 30.6542 12.5 24.8V12Z"
          fill={`url(#${goldGradId})`}
        />

        {/* Speed Chevrons / Forward Motion Winglet at top-right (Evokes rapid motorcycle throttle & Kekes moving forward) */}
        <path
          d="M28.5 10.2L34.5 10.2C35.0523 10.2 35.5 10.6477 35.5 11.2V15C35.5 15.35 35.2 15.6 34.85 15.45L28.2 12.2C27.8 12.02 27.8 11.45 28.2 11.3L28.5 10.2Z"
          fill={`url(#${goldAccentGradId})`}
        />

        {/* Velocity Notch in core of U (Road Perspective Path) */}
        <path
          d="M22 15L25 21H19L22 15Z"
          fill={`url(#${goldAccentGradId})`}
          opacity="0.9"
        />

        {/* Central GPS / Ignition Beacon Node */}
        <circle cx="22" cy="24.5" r="2.2" fill="#FEF08A" />
        <circle cx="22" cy="24.5" r="1.1" fill="#78350F" />
      </g>

      {/* Top subtle highlight reflection bar */}
      <path
        d="M12 4.5H32"
        stroke="#FFFFFF"
        strokeOpacity="0.25"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const UkadaLogo: React.FC<UkadaLogoProps> = ({
  size = 'md',
  variant = 'full',
  subtitle = 'HYPERLOCAL RIDE',
  className = '',
  onClick,
  theme = 'dark',
}) => {
  // Dimension scaling
  const dimensions = {
    sm: { icon: 28, text: 'text-sm', sub: 'text-[9px]', gap: 'gap-2' },
    md: { icon: 36, text: 'text-base', sub: 'text-[10px]', gap: 'gap-2.5' },
    lg: { icon: 44, text: 'text-xl', sub: 'text-[11px]', gap: 'gap-3' },
    xl: { icon: 54, text: 'text-2xl', sub: 'text-xs', gap: 'gap-3.5' },
  }[size];

  const content = (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`group inline-flex items-center ${dimensions.gap} select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Precision Icon Mark */}
      <div className="relative shrink-0 transition-transform duration-200 group-hover:scale-105">
        <UkadaMarkIcon size={dimensions.icon} idSuffix={size} />
      </div>

      {/* Typographic Wordmark & Identity Tagline */}
      {variant !== 'icon' && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight ${dimensions.text} ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              } group-hover:text-amber-400 transition-colors`}
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", letterSpacing: '-0.03em' }}
            >
              UKADA
            </span>
            <span className="font-extrabold tracking-wider text-amber-400 font-mono text-[11px] px-1 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded">
              RIDE
            </span>
          </div>

          {subtitle && (
            <span
              className={`font-mono uppercase tracking-widest ${dimensions.sub} mt-0.5 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              } font-medium`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return content;
};
