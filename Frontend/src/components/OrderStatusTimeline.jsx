import React from 'react';
import { CheckCircle2, Clock, ChefHat, Bike, Home } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'Order Received', label: 'Order Received', icon: Clock, defaultDesc: 'Restaurant confirmed your order' },
  { key: 'Preparing', label: 'Preparing Food', icon: ChefHat, defaultDesc: 'Chefs are cooking your meal fresh' },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Bike, defaultDesc: 'Delivery rider is on the way' },
  { key: 'Delivered', label: 'Delivered', icon: Home, defaultDesc: 'Order safely delivered to you' },
];

export default function OrderStatusTimeline({ currentStatus = 'Order Received', timelineData = [] }) {
  // Determine index of current status
  const currentStepIndex = STATUS_STEPS.findIndex(
    (s) => s.key.toLowerCase() === (currentStatus || '').toLowerCase()
  );

  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
        {STATUS_STEPS.map((step, idx) => {
          const isCompleted = idx <= activeIndex;
          const isCurrent = idx === activeIndex;
          const IconComponent = step.icon;

          // Find custom timeline entry if passed
          const customEntry = timelineData.find(
            (t) => t.status.toLowerCase() === step.key.toLowerCase()
          );

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                position: 'relative',
              }}
            >
              {/* Connecting vertical line (unless last item) */}
              {idx < STATUS_STEPS.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    left: '18px',
                    top: '36px',
                    bottom: '-20px',
                    width: '2px',
                    backgroundColor: idx < activeIndex ? 'var(--primary-orange)' : 'var(--border-color)',
                    transition: 'background-color 0.3s ease',
                  }}
                />
              )}

              {/* Status Icon Indicator */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor: isCurrent
                    ? 'var(--primary-orange)'
                    : isCompleted
                    ? 'rgba(255, 107, 0, 0.15)'
                    : 'var(--bg-input)',
                  border: `2px solid ${isCompleted ? 'var(--primary-orange)' : 'var(--border-color)'}`,
                  color: isCurrent ? '#FFFFFF' : isCompleted ? 'var(--primary-orange)' : 'var(--text-muted)',
                  boxShadow: isCurrent ? 'var(--shadow-orange)' : 'none',
                  zIndex: 2,
                  transition: 'all 0.3s ease',
                }}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircle2 size={18} color="var(--primary-orange)" />
                ) : (
                  <IconComponent size={18} />
                )}
              </div>

              {/* Text details */}
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500,
                      color: isCurrent ? '#FFFFFF' : isCompleted ? '#E5E7EB' : 'var(--text-muted)',
                    }}
                  >
                    {step.label}
                  </h4>
                  {customEntry?.time && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: isCurrent ? 'var(--secondary-orange)' : 'var(--text-muted)',
                        fontWeight: 600,
                      }}
                    >
                      {customEntry.time}
                    </span>
                  )}
                </div>

                <p
                  style={{
                    fontSize: '0.8rem',
                    color: isCurrent ? 'var(--text-secondary)' : 'var(--text-muted)',
                    marginTop: '2px',
                    lineHeight: 1.4,
                  }}
                >
                  {customEntry?.desc || step.defaultDesc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
