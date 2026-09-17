import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context';
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { AdminShell } from '../components/layout/AdminShell';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ComingSoonPage } from '../pages/placeholder/ComingSoonPage';

// AuthGuard to protect admin routes
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// GuestGuard to redirect already logged in users from login/forgot-password
const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root redirects */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

      {/* Guest Authentication Routes */}
      <Route
        path="/admin/login"
        element={
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        }
      />
      <Route
        path="/admin/forgot-password"
        element={
          <GuestGuard>
            <ForgotPasswordPage />
          </GuestGuard>
        }
      />

      {/* Protected Admin Shell Routes */}
      <Route
        path="/admin"
        element={
          <AuthGuard>
            <AdminShell />
          </AuthGuard>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Future CMS Modules (Prepared Architecture) */}
        <Route path="products" element={<ComingSoonPage />} />
        <Route path="products/new" element={<ComingSoonPage />} />
        <Route path="products/:id" element={<ComingSoonPage />} />
        <Route path="missions" element={<ComingSoonPage />} />
        <Route path="build-log" element={<ComingSoonPage />} />
        <Route path="chapters" element={<ComingSoonPage />} />
        <Route path="media" element={<ComingSoonPage />} />
        <Route path="contacts" element={<ComingSoonPage />} />
        <Route path="team" element={<ComingSoonPage />} />
        <Route path="settings" element={<ComingSoonPage />} />
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};
