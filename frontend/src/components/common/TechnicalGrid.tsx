import React from 'react';

export const TechnicalGrid: React.FC = () => {
  return (
    <div className="blueprint-grid-overlay" aria-hidden="true">
      {/* Decorative technical crosshairs and coordinate stamps */}
      <svg
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '24px',
          height: '24px',
          stroke: 'rgba(255, 255, 255, 0.15)',
          strokeWidth: '1px',
        }}
        viewBox="0 0 24 24"
      >
        <line x1="12" y1="0" x2="12" y2="24" />
        <line x1="0" y1="12" x2="24" y2="12" />
        <circle cx="12" cy="12" r="3" fill="none" />
      </svg>

      <svg
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '24px',
          height: '24px',
          stroke: 'rgba(255, 255, 255, 0.15)',
          strokeWidth: '1px',
        }}
        viewBox="0 0 24 24"
      >
        <line x1="12" y1="0" x2="12" y2="24" />
        <line x1="0" y1="12" x2="24" y2="12" />
      </svg>
    </div>
  );
};
