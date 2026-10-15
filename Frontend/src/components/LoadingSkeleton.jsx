import React from 'react';

export function FoodCardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="skeleton" style={{ width: '100%', paddingTop: '62%' }} />
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="skeleton" style={{ width: '70%', height: '20px' }} />
        <div className="skeleton" style={{ width: '90%', height: '14px' }} />
        <div className="skeleton" style={{ width: '50%', height: '14px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <div className="skeleton" style={{ width: '60px', height: '24px' }} />
          <div className="skeleton" style={{ width: '75px', height: '32px', borderRadius: 'var(--radius-full)' }} />
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton" style={{ width: '120px', height: '20px' }} />
        <div className="skeleton" style={{ width: '80px', height: '20px' }} />
      </div>
      <div className="skeleton" style={{ width: '100%', height: '50px', borderRadius: 'var(--radius-md)' }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <div className="skeleton" style={{ width: '110px', height: '36px', borderRadius: 'var(--radius-md)' }} />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ type = 'food', count = 4 }) {
  const items = Array.from({ length: count });

  if (type === 'order') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.25rem',
      }}
    >
      {items.map((_, i) => (
        <FoodCardSkeleton key={i} />
      ))}
    </div>
  );
}
