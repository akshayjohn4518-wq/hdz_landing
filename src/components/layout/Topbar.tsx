import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Terminal, Search, ShieldCheck } from 'lucide-react';
import { AdminBadge } from '../ui/AdminBadge';

interface TopbarProps {
  onToggleMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu }) => {
  const location = useLocation();

  // Generate dynamic breadcrumb segments
  const getBreadcrumbs = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/products')) return ['CONTENT', 'PRODUCTS'];
    if (path.includes('/missions')) return ['CONTENT', 'MISSIONS'];
    if (path.includes('/build-log')) return ['CONTENT', 'BUILD LOG'];
    if (path.includes('/chapters')) return ['CONTENT', 'CHAPTERS'];
    if (path.includes('/media')) return ['ASSETS', 'MEDIA'];
    if (path.includes('/contacts')) return ['COMMUNICATION', 'CONTACTS'];
    if (path.includes('/team')) return ['ORGANIZATION', 'TEAM'];
    if (path.includes('/settings')) return ['ORGANIZATION', 'SETTINGS'];
    return ['OPERATIONS', 'DASHBOARD'];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation drawer"
        >
          <Menu size={20} />
        </button>

        <nav className="topbar-breadcrumbs" aria-label="Breadcrumb">
          <Terminal size={14} color="var(--dz-text-dim)" />
          <span>DAY ZERO</span>
          <span style={{ color: 'var(--dz-text-dim)' }}>&gt;</span>
          <span>{breadcrumbs[0]}</span>
          <span style={{ color: 'var(--dz-text-dim)' }}>&gt;</span>
          <span className="active">{breadcrumbs[1]}</span>
        </nav>
      </div>

      <div className="topbar-right">
        {/* Quick Search trigger mock */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            backgroundColor: 'var(--dz-bg-surface-elevated)',
            border: '1px solid var(--dz-border-subtle)',
            borderRadius: 'var(--dz-radius-xs)',
            fontFamily: 'var(--dz-font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--dz-text-dim)',
            userSelect: 'none',
          }}
        >
          <Search size={12} />
          <span>QUICK JUMP</span>
          <span
            style={{
              padding: '1px 4px',
              backgroundColor: 'var(--dz-bg-surface-subtle)',
              border: '1px solid var(--dz-border-default)',
              fontSize: '0.625rem',
              color: 'var(--dz-text-muted)',
            }}
          >
            ⌘K
          </span>
        </div>

        {/* Status indicator - clean restrained outline, no glowing green */}
        <AdminBadge variant="outline">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={12} />
            SYSTEM OPERATIONAL
          </span>
        </AdminBadge>
      </div>
    </header>
  );
};
