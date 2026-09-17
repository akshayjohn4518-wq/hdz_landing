import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface AdminTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`dz-tabs ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={`dz-tab ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                style={{
                  marginLeft: '6px',
                  padding: '1px 5px',
                  fontSize: '0.625rem',
                  backgroundColor: isActive
                    ? 'var(--dz-accent)'
                    : 'var(--dz-bg-surface-elevated)',
                  color: isActive ? 'var(--dz-text-on-accent)' : 'var(--dz-text-dim)',
                  borderRadius: '2px',
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
