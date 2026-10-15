import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '380px',
      width: 'calc(100% - 40px)',
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '12px 16px',
              background: '#1A1A1A',
              border: `1px solid ${isSuccess ? '#10B981' : isError ? '#EF4444' : '#FF6B00'}`,
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
              color: '#FFFFFF',
              animation: 'fadeIn 0.25s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isSuccess && <CheckCircle2 size={18} color="#10B981" />}
              {isError && <AlertCircle size={18} color="#EF4444" />}
              {!isSuccess && !isError && <Info size={18} color="#FF6B00" />}
              <span style={{ fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.4 }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              style={{
                color: '#888',
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
