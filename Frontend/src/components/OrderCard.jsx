import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight, RotateCcw, PackageCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function OrderCard({ order }) {
  const { addToCart } = useCart();

  const isDelivered = order.status?.toLowerCase() === 'delivered';
  const isActive = !isDelivered;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' };
      case 'out for delivery':
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' };
      case 'preparing':
        return { bg: 'rgba(255, 107, 0, 0.15)', text: '#FF8C00', border: 'rgba(255, 107, 0, 0.3)' };
      case 'order received':
      default:
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' };
    }
  };

  const badgeStyle = getStatusBadge(order.status);

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recent Order';

  const handleReorder = () => {
    (order.items || []).forEach((item) => {
      addToCart(
        {
          id: item.id || `reorder-${Date.now()}`,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category || 'Reorder',
        },
        item.quantity || 1
      );
    });
  };

  return (
    <div
      id={`order-card-${order.id}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Top Header: ID & Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>
              Order #{order.id}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: badgeStyle.bg,
                color: badgeStyle.text,
                border: `1px solid ${badgeStyle.border}`,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {order.status}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            <Clock size={12} />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Amount</span>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-orange)' }}>
            ${Number(order.total || 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Items preview */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '0.75rem',
          backgroundColor: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {(order.items || []).map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                />
              )}
              <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                {item.quantity}x {item.name}
              </span>
              {idx < (order.items || []).length - 1 && (
                <span style={{ color: 'var(--border-color)', margin: '0 4px' }}>•</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address note */}
      {order.deliveryAddress && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Deliver to: </span>
          {order.deliveryAddress.tag ? `[${order.deliveryAddress.tag}] ` : ''}
          {order.deliveryAddress.street || order.deliveryAddress}
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        {isDelivered && (
          <button
            type="button"
            onClick={handleReorder}
            className="btn-secondary"
            style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
          >
            <RotateCcw size={14} />
            <span>Reorder Items</span>
          </button>
        )}

        <Link
          to={`/track-order/${order.id}`}
          className="btn-primary"
          style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
          id={`track-order-btn-${order.id}`}
        >
          {isActive ? (
            <>
              <span>Track Live Order</span>
              <ChevronRight size={15} />
            </>
          ) : (
            <>
              <PackageCheck size={15} />
              <span>View Order Details</span>
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
