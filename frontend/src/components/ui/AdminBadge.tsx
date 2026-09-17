import React from 'react';

export interface AdminBadgeProps {
  children: React.ReactNode;
  variant?: 'operational' | 'warning' | 'error' | 'neutral' | 'outline';
  showDot?: boolean;
  isPulsing?: boolean;
  className?: string;
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  children,
  variant = 'neutral',
  showDot = false,
  isPulsing = false,
  className = '',
}) => {
  return (
    <span className={`dz-badge dz-badge--${variant} ${className}`}>
      {showDot && (
        <span
          className={`dz-status-dot ${isPulsing ? 'is-pulsing' : ''}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};
