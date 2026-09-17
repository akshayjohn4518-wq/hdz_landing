import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AdminDrawer } from '../ui/AdminDrawer';
import { AdminToastContainer } from '../ui/AdminToast';
import { Menu } from 'lucide-react';

export const AdminShell: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="admin-shell">
      {/* Desktop Persistent Sidebar */}
      <Sidebar />

      {/* Mobile / Tablet Navigation Drawer */}
      <AdminDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="NAVIGATION"
      >
        <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
      </AdminDrawer>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Mobile menu trigger - only visible on small screens */}
        <button
          className="mobile-menu-trigger"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="admin-page-content">
          <Outlet />
        </div>
      </main>

      {/* Global Toast Container */}
      <AdminToastContainer />
    </div>
  );
};
