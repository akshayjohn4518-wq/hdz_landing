import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminCard } from '../../components/ui/AdminCard';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminModal } from '../../components/ui/AdminModal';
import {
  Box,
  Mail,
  Target,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Clock,
  ExternalLink,
  Activity,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ActivityItemData {
  id: string;
  type: 'product_published' | 'contact_received' | 'product_updated' | 'mission_updated';
  title: string;
  meta: string;
  timestamp: string;
  badge: {
    label: string;
    variant: 'operational' | 'warning' | 'neutral';
  };
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalActionTitle, setModalActionTitle] = useState('');

  // Realistic mock data as requested by PRD
  const stats = [
    {
      label: 'Products',
      count: '12',
      unit: 'Active',
      delta: '+2 this cycle',
      icon: <Box size={16} />,
      coord: 'REG: 01',
    },
    {
      label: 'Contacts',
      count: '48',
      unit: 'Inquiries',
      delta: '8 awaiting review',
      icon: <Mail size={16} />,
      coord: 'MSG: 02',
    },
    {
      label: 'Missions',
      count: '04',
      unit: 'Deployed',
      delta: '1 scheduled dispatch',
      icon: <Target size={16} />,
      coord: 'OPS: 03',
    },
  ];

  const recentActivities: ActivityItemData[] = [
    {
      id: 'act-01',
      type: 'product_published',
      title: 'Project Chimera v1.0 published',
      meta: 'Production release deployed to global edge',
      timestamp: '14m ago',
      badge: { label: 'PUBLISHED', variant: 'neutral' },
    },
    {
      id: 'act-02',
      type: 'contact_received',
      title: 'Partnership dispatch from Quantum Labs',
      meta: 'Received via public inquiry endpoint',
      timestamp: '1h ago',
      badge: { label: 'INQUIRY', variant: 'warning' },
    },
    {
      id: 'act-03',
      type: 'product_updated',
      title: 'Specter Audio Engine spec revised',
      meta: 'Technical schematics & latency targets updated',
      timestamp: '3h ago',
      badge: { label: 'UPDATED', variant: 'neutral' },
    },
    {
      id: 'act-04',
      type: 'mission_updated',
      title: 'Orbital Relay Phase 2 milestone reached',
      meta: 'Telemetry verification confirmed by ground team',
      timestamp: '6h ago',
      badge: { label: 'MISSION', variant: 'neutral' },
    },
  ];

  const handleQuickAction = (actionTitle: string, route?: string) => {
    if (route) {
      navigate(route);
    } else {
      setModalActionTitle(actionTitle);
      setModalOpen(true);
    }
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-area">
          <span className="dashboard-pretitle">OPERATIONS CONTROL: OVERVIEW</span>
          <h1 className="dashboard-title">DASHBOARD</h1>
          <p className="dashboard-desc">What&apos;s happening across Day Zero.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="tech-coord">SYS_STATUS: ACTIVE</span>
          <AdminBadge variant="outline">
            OPERATIONAL
          </AdminBadge>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="dashboard-metrics-grid" aria-label="System Metrics">
        {stats.map((item) => (
          <div key={item.label} className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">{item.label}</span>
              <div style={{ color: 'var(--dz-text-muted)' }}>{item.icon}</div>
            </div>

            <div className="metric-value-row">
              <span className="metric-number">{item.count}</span>
              <span className="tech-label" style={{ color: 'var(--dz-text-secondary)' }}>
                {item.unit}
              </span>
            </div>

            <div className="metric-meta">
              <span className="tech-coord">{item.coord}</span>
              <span>•</span>
              <span className="metric-delta">{item.delta}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Site Status Widget */}
      <section aria-label="Site Status">
        <div className="status-widget">
          <div className="status-widget-left">
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--dz-bg-surface-elevated)',
                border: '1px solid var(--dz-border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--dz-text-primary)',
              }}
            >
              <ShieldCheck size={20} />
            </div>

            <div className="status-widget-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-widget-title">SITE STATUS: OPERATIONAL</span>
                <AdminBadge variant="outline">HEALTHY</AdminBadge>
              </div>
              <p className="status-widget-desc">
                All public gateways, CDN distribution networks, and telemetry pipelines are running within SLA limits.
              </p>
            </div>
          </div>

          <div className="status-widget-metrics">
            <div className="status-metric-item">
              <span className="status-metric-label">UPTIME</span>
              <span className="status-metric-val">99.98%</span>
            </div>
            <div className="status-metric-item">
              <span className="status-metric-label">EDGE LATENCY</span>
              <span className="status-metric-val">24ms</span>
            </div>
            <div className="status-metric-item">
              <span className="status-metric-label">NETWORK</span>
              <span className="status-metric-val">GLOBAL POPS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Columns: Recent Activity (2fr) & Quick Actions (1fr) */}
      <section className="dashboard-grid-columns">
        {/* Recent Activity */}
        <AdminCard
          title="RECENT ACTIVITY"
          subtitle="Real-time log of editorial and system events"
          headerAction={
            <span className="tech-coord">FEED: LIVE</span>
          }
        >
          <div className="activity-feed-list">
            {recentActivities.map((act) => (
              <div key={act.id} className="activity-item">
                <div className="activity-left">
                  <div className="activity-icon-box">
                    {act.type === 'product_published' && <Sparkles size={14} />}
                    {act.type === 'contact_received' && <Mail size={14} />}
                    {act.type === 'product_updated' && <Box size={14} />}
                    {act.type === 'mission_updated' && <Activity size={14} />}
                  </div>

                  <div className="activity-details">
                    <div className="activity-event-title">{act.title}</div>
                    <div className="activity-event-meta">{act.meta}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AdminBadge variant={act.badge.variant}>
                    {act.badge.label}
                  </AdminBadge>
                  <span className="activity-timestamp">
                    <Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />
                    {act.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Quick Actions */}
        <AdminCard
          title="QUICK ACTIONS"
          subtitle="Accelerated operations & dispatches"
          headerAction={<span className="tech-coord">ACTIONS: 03</span>}
        >
          <div className="quick-actions-container">
            <button
              className="quick-action-btn"
              onClick={() => handleQuickAction('Create New Product', '/admin/products')}
            >
              <div className="quick-action-left">
                <Plus size={14} color="var(--dz-accent)" />
                <span>New Product</span>
              </div>
              <ArrowUpRight size={14} color="var(--dz-text-dim)" />
            </button>

            <button
              className="quick-action-btn"
              onClick={() => handleQuickAction('Create New Mission', '/admin/missions')}
            >
              <div className="quick-action-left">
                <Plus size={14} color="var(--dz-accent)" />
                <span>New Mission</span>
              </div>
              <ArrowUpRight size={14} color="var(--dz-text-dim)" />
            </button>

            <button
              className="quick-action-btn"
              onClick={() => handleQuickAction('View Contacts Registry', '/admin/contacts')}
            >
              <div className="quick-action-left">
                <ExternalLink size={14} color="var(--dz-accent)" />
                <span>View Contacts</span>
              </div>
              <ArrowUpRight size={14} color="var(--dz-text-dim)" />
            </button>
          </div>
        </AdminCard>
      </section>

      {/* Quick Action Info Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="OPERATIONAL DISPATCH"
        footer={
          <AdminButton variant="primary" size="sm" onClick={() => setModalOpen(false)}>
            ACKNOWLEDGE
          </AdminButton>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="var(--dz-status-operational)" />
            <span style={{ fontFamily: 'var(--dz-font-mono)', fontWeight: 600, color: 'var(--dz-text-primary)' }}>
              {modalActionTitle}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--dz-text-muted)', lineHeight: 1.6 }}>
            This capability is designated for subsequent CMS phases in the Day Zero Admin roadmap.
            The architecture is prepared for immediate integration.
          </p>
        </div>
      </AdminModal>
    </div>
  );
};
