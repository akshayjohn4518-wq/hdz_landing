import { useToast } from '../../context';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const AdminToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="dz-toast-container">
      {toasts.map((toast) => {
        let icon = <Info size={16} color="var(--dz-text-muted)" />;
        if (toast.type === 'success') {
          icon = <CheckCircle2 size={16} color="var(--dz-status-operational)" />;
        } else if (toast.type === 'error') {
          icon = <AlertTriangle size={16} color="var(--dz-status-error)" />;
        }

        return (
          <div key={toast.id} className={`dz-toast dz-toast--${toast.type}`}>
            {icon}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                color: 'var(--dz-text-dim)',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
