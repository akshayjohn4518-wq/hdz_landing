import React from 'react';

export interface AdminLoadingStateProps {
  label?: string;
  className?: string;
}

export const AdminLoadingState: React.FC<AdminLoadingStateProps> = ({
  label = 'SYNCHRONIZING...',
  className = '',
}) => {
  return (
    <div
      className={`dz-loading-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        gap: '12px',
      }}
    >
      <div className="dz-loading-spinner" />
      <span
        style={{
          fontFamily: 'var(--dz-font-mono)',
          fontSize: '0.6875rem',
          letterSpacing: '0.12em',
          color: 'var(--dz-text-muted)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </div>
  );
};
