import React from 'react';
import { Layers } from 'lucide-react';

export interface AdminEmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  title = 'No Data Available',
  description = 'There are no active records in this registry.',
  icon = <Layers size={32} />,
  action,
  className = '',
}) => {
  return (
    <div className={`dz-empty-state ${className}`}>
      <div className="dz-empty-icon">{icon}</div>
      <h4 className="dz-empty-title">{title}</h4>
      <p className="dz-empty-desc">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
