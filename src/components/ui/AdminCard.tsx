import React from 'react';

export interface AdminCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  isInteractive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  isInteractive = false,
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`dz-card ${isInteractive ? 'dz-card--interactive' : ''} ${className}`}
      onClick={onClick}
      role={isInteractive && onClick ? 'button' : undefined}
      tabIndex={isInteractive && onClick ? 0 : undefined}
    >
      {(title || headerAction) && (
        <div className="dz-card-header">
          <div className="dz-card-title-group">
            {title && <h3 className="dz-card-title">{title}</h3>}
            {subtitle && <p className="dz-card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="dz-card-body">{children}</div>
      {footer && <div className="dz-card-footer">{footer}</div>}
    </div>
  );
};
