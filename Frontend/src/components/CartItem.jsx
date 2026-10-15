import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const optionsTotal = (item.selectedOptions || []).reduce((acc, opt) => acc + (opt.price || 0), 0);
  const effectiveUnitPrice = item.price + optionsTotal;
  const itemTotal = effectiveUnitPrice * item.quantity;

  return (
    <div
      id={`cart-item-${item.id}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'border-color 0.15s ease',
      }}
    >
      {/* Thumbnail */}
      <img
        src={item.image}
        alt={item.name}
        style={{
          width: '74px',
          height: '74px',
          borderRadius: 'var(--radius-md)',
          objectFit: 'cover',
          flexShrink: 0,
          backgroundColor: '#1c1c1c',
        }}
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4
          style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.name}
        </h4>

        {/* Selected options if any */}
        {item.selectedOptions && item.selectedOptions.length > 0 && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            + {item.selectedOptions.map((o) => o.name).join(', ')}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ${effectiveUnitPrice.toFixed(2)} each
          </span>
          <span style={{ color: 'var(--border-color)' }}>•</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-orange)' }}>
            ${itemTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Quantity Controls */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            padding: '2px',
            gap: '6px',
          }}
        >
          <button
            type="button"
            id={`cart-decrease-${item.id}`}
            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedOptions)}
            aria-label={`Decrease quantity of ${item.name}`}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              color: 'var(--primary-orange)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Minus size={13} />
          </button>
          <span
            id={`cart-qty-${item.id}`}
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#FFFFFF',
              minWidth: '16px',
              textAlign: 'center',
            }}
          >
            {item.quantity}
          </span>
          <button
            type="button"
            id={`cart-increase-${item.id}`}
            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedOptions)}
            aria-label={`Increase quantity of ${item.name}`}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--primary-orange)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          id={`cart-remove-${item.id}`}
          onClick={() => removeFromCart(item.id, item.selectedOptions)}
          aria-label={`Remove ${item.name} from cart`}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          className="remove-btn-hover"
        >
          <Trash2 size={15} />
        </button>
      </div>
      <style>{`
        .remove-btn-hover:hover {
          color: #EF4444 !important;
          border-color: #EF4444 !important;
          background-color: rgba(239, 68, 68, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
