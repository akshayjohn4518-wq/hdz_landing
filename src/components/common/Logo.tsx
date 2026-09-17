import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  color?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 24,
  showText = false,
  color = '#FFFFFF',
  className = '',
}) => {
  return (
    <div
      className={`dz-logo-wrapper ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-label="Day Zero Logo"
      >
        {/* Horizontal diameter line */}
        <line
          x1="6"
          y1="49"
          x2="94"
          y2="49"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Top semicircle */}
        <path
          d="M 12 49 A 38 38 0 0 1 88 49"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Bottom arc */}
        <path
          d="M 12 49 A 38 38 0 0 0 85 66"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Arrowhead */}
        <path
          d="M 74 70 L 85 66 L 85 78"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <span
          style={{
            fontFamily: 'var(--dz-font-mono)',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--dz-text-primary)',
          }}
        >
          Day Zero
        </span>
      )}
    </div>
  );
};
