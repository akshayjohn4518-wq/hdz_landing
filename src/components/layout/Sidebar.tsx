import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Target,
  FileCode2,
  BookOpen,
  Image as ImageIcon,
  Mail,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context';
import { AdminBadge } from '../ui/AdminBadge';

interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItemClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside className="admin-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <Logo size={22} />
          <div className="sidebar-brand-title">
            <span className="sidebar-brand-main">DAY ZERO</span>
            <span className="sidebar-brand-badge">ADMIN</span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="sidebar-nav">
        {/* OPERATIONS */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">OPERATIONS</div>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'is-active' : ''}`}
            onClick={navItemClick}
          >
            <div className="sidebar-nav-item-left">
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </div>
            <span className="tech-coord">01</span>
          </NavLink>
        </div>

        {/* CONTENT */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">CONTENT</div>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'is-active' : ''}`}
            onClick={navItemClick}
          >
            <div className="sidebar-nav-item-left">
              <Box size={16} />
              <span>Products</span>
            </div>
            <AdminBadge variant="outline">SOON</AdminBadge>
          </NavLink>

          <NavLink
            to="/admin/missions"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'is-active' : ''}`}
            onClick={navItemClick}
          >
            <div className="sidebar-nav-item-left">
              <Target size={16} />
              <span>Missions</span>
            </div>
            <AdminBadge variant="outline">SOON</AdminBadge>
          </NavLink>

          <NavLink
            to="/admin/build-log"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'is-active' : ''}`}
            onClick={navItemClick}
          >
            <div className="sidebar-nav-item-left">
              <FileCode2 size={16} />
              <span>Build Log</span>
            </div>
            <AdminBadge variant="outline">SOON</AdminBadge>
          </NavLink>

          <NavLink
            to="/admin/chapters"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'is-active' : ''}`}
            onClick={navItemClick}
          >
            <div className="sidebar-nav-item-left">
              <BookOpen size={16} />
              <span>Chapters</span>
            </div>
            <AdminBadge variant="outline">SOON</AdminBadge>
          </NavLink>
        </div>

        {/* ASSETS */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">ASSETS</div>
          <NavLink
            to="/admin/media"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'is-active' : ''}`}
            onClick={navItemClick}
          >
            <div className="sidebar-nav-item-left">
              <ImageIcon size={16} />
              <span>Media</span>
            </div>
            <AdminBadge variant="outline">SOON</AdminBadge>
          </NavLink>
        </div>

        {/* COMMUNICATION */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">COMMUNICATION</div>
          <NavLink
            to="/admin/contacts"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'is-active' : ''}`}
            onClick={navItemClick}
          >
            <div className="sidebar-nav-item-left">
              <Mail size={16} />
              <span>Contacts</span>
            </div>
            <AdminBadge variant="outline">SOON</AdminBadge>
          </NavLink>
        </div>

        {/* ORGANIZATION */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">ORGANIZATION</div>
          <NavLink
            to="/admin/team"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'is-active' : ''}`}
            onClick={navItemClick}
          >
            <div className="sidebar-nav-item-left">
              <Users size={16} />
              <span>Team</span>
            </div>
            <AdminBadge variant="outline">SOON</AdminBadge>
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'is-active' : ''}`}
            onClick={navItemClick}
          >
            <div className="sidebar-nav-item-left">
              <Settings size={16} />
              <span>Settings</span>
            </div>
            <AdminBadge variant="outline">SOON</AdminBadge>
          </NavLink>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="sidebar-bottom">
        <div className="sidebar-user-info">
          <div>
            <div className="sidebar-user-name">{user?.name || 'Operator'}</div>
            <div className="sidebar-user-role">{user?.role || 'AUTHENTICATED'}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Terminate Session"
            style={{
              padding: '6px',
              color: 'var(--dz-text-muted)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--dz-border-subtle)',
              borderRadius: '2px',
            }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};
