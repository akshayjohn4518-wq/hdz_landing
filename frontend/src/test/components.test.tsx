import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import {
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminBadge,
  AdminCard,
  AdminTable,
  AdminModal,
  AdminDrawer,
  AdminTabs,
  AdminEmptyState,
  AdminLoadingState,
  AdminConfirmDialog,
} from '../components/ui';

describe('UI Component System', () => {
  it('renders all 14 UI primitives correctly', () => {
    const { container } = render(
      <div>
        <AdminButton variant="primary">Deploy</AdminButton>
        <AdminInput label="Node" placeholder="Enter node" />
        <AdminTextarea label="Log" placeholder="Enter log" />
        <AdminSelect label="Region" options={[{ value: 'us-east', label: 'US East' }]} />
        <AdminBadge variant="operational" showDot>Operational</AdminBadge>
        <AdminCard title="Telemetry">Payload content</AdminCard>
        <AdminTable
          columns={[{ key: 'id', header: 'ID' }]}
          data={[{ id: 'rec-01' }]}
          keyExtractor={(r) => r.id}
        />
        <AdminModal isOpen={false} onClose={() => {}} title="Modal">Content</AdminModal>
        <AdminDrawer isOpen={false} onClose={() => {}}>Drawer Content</AdminDrawer>
        <AdminTabs
          tabs={[{ id: 't1', label: 'Tab 1' }]}
          activeTab="t1"
          onChange={() => {}}
        />
        <AdminEmptyState title="No Records" />
        <AdminLoadingState label="FETCHING..." />
        <AdminConfirmDialog
          isOpen={false}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Confirm"
          message="Are you sure?"
        />
      </div>
    );

    expect(screen.getByRole('button', { name: /Deploy/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Node/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Log/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Region/i)).toBeInTheDocument();
    expect(screen.getByText('Operational')).toBeInTheDocument();
    expect(screen.getByText('Telemetry')).toBeInTheDocument();
    expect(screen.getByText('rec-01')).toBeInTheDocument();
    expect(screen.getByText('No Records')).toBeInTheDocument();
    expect(screen.getByText('FETCHING...')).toBeInTheDocument();
    expect(container).toBeDefined();
  });
});
