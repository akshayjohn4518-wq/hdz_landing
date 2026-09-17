import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AdminEmptyState } from '../../components/ui/AdminEmptyState';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { Construction, ArrowLeft } from 'lucide-react';

export const ComingSoonPage: React.FC = () => {
  const location = useLocation();

  // Extract module name from path
  const pathSegment = location.pathname.replace('/admin/', '').toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--dz-border-subtle)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="tech-coord">CMS MODULE: RESERVED</span>
          <h1 className="editorial-h2">{pathSegment}</h1>
        </div>
        <AdminBadge variant="outline">PHASE 02+ TARGET</AdminBadge>
      </div>

      <AdminEmptyState
        icon={<Construction size={36} color="var(--dz-text-muted)" />}
        title={`MODULE [${pathSegment}] UNDER CONSTRUCTION`}
        description="This CMS domain is architected for Phase 02 and beyond. The technical foundation and component contracts have been established."
        action={
          <Link to="/admin/dashboard">
            <AdminButton variant="secondary" size="sm" icon={<ArrowLeft size={14} />}>
              Return to Dashboard
            </AdminButton>
          </Link>
        }
      />
    </div>
  );
};
