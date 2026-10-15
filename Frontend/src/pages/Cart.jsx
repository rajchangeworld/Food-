import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, VALID_PROMOS } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { ShoppingBag, ArrowRight, Tag, Trash2, ShieldCheck, MapPin, CheckCircle, Percent } from 'lucide-react';

export default function Cart() {
  const {
    items,
    subtotal,
    deliveryFee,
    restaurantFee,
    discount,
    grandTotal,
    promoCode,
    activePromo,
    applyPromo,
    removePromo,
    clearCart,
    selectedAddress,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      const ok = applyPromo(inputCoupon.trim());
      if (ok) setInputCoupon('');
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="animate-fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: '2rem 1rem',
        }}
      >
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-input)',
            border: '2px dashed var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            color: 'var(--text-muted)',
          }}
        >
          <ShoppingBag size={42} strokeWidth={1.5} color="var(--primary-orange)" />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          Your Cart is Empty
        </h2>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '380px', marginBottom: '1.75rem' }}>
          Looks like you haven't added any mouth-watering dishes yet. Explore our delicious burgers, artisan pizzas, and dum biryani!
        </p>

        <Link
          to="/"
          id="explore-menu-btn"
          className="btn-primary"
          style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
        >
          <span>Explore Delicious Menu</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>
            Shopping Cart
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Review your order before proceeding to secure checkout
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowClearConfirm(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            color: '#EF4444',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Trash2 size={14} />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Clear Cart Confirmation Dialog */}
      {showClearConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              maxWidth: '360px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              Clear all items?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Are you sure you want to remove all food items from your cart?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowClearConfirm(false)}
                style={{ padding: '0.6rem 1rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ backgroundColor: '#EF4444', borderColor: '#EF4444', padding: '0.6rem 1rem' }}
                onClick={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
              >
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Items on Left, Order Summary on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {items.map((item, idx) => (
            <CartItem key={`${item.id}-${idx}`} item={item} />
          ))}

          {/* Delivery Location Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--orange-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-orange)',
                }}
              >
                <MapPin size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Delivery Location</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>
                  {selectedAddress ? `${selectedAddress.tag} • ${selectedAddress.street}` : 'Home Address'}
                </span>
              </div>
            </div>

            <Link
              to="/profile"
              style={{
                fontSize: '0.8rem',
                color: 'var(--primary-orange)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Change
            </Link>
          </div>
        </div>

        {/* Right Column: Coupon & Bill Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Promo Code Input & Badges */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag size={16} color="var(--primary-orange)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>
                Coupons & Offers
              </h3>
            </div>

            {promoCode ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="#10B981" />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981' }}>
                      {promoCode} Applied!
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
                      {activePromo?.label || 'Discount applied to your order'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  id="remove-promo-button"
                  onClick={removePromo}
                  style={{
                    fontSize: '0.78rem',
                    color: '#EF4444',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                <input
                  id="coupon-code-input"
                  type="text"
                  placeholder="Enter code (e.g. TASTY50)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                  style={{ flex: 1, textTransform: 'uppercase' }}
                />
                <button
                  type="submit"
                  id="apply-coupon-button"
                  className="btn-secondary"
                  style={{ padding: '0 1.25rem', whiteSpace: 'nowrap' }}
                >
                  Apply
                </button>
              </form>
            )}

            {/* Quick coupon chips */}
            {!promoCode && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {Object.keys(VALID_PROMOS).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyPromo(key)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px dashed var(--border-color)',
                      color: 'var(--secondary-orange)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Percent size={11} />
                    <span>{key}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bill Breakdown Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              Bill Details
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <span>Item Subtotal</span>
              <span id="bill-subtotal" style={{ color: '#FFFFFF', fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Delivery Partner Fee</span>
                {subtotal >= 35 && <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>(FREE &gt;$35)</span>}
              </div>
              <span id="bill-delivery-fee" style={{ color: deliveryFee === 0 ? '#10B981' : '#FFFFFF', fontWeight: 600 }}>
                {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <span>Restaurant Packaging & Taxes</span>
              <span id="bill-restaurant-fee" style={{ color: '#FFFFFF', fontWeight: 600 }}>${restaurantFee.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#10B981' }}>
                <span>Coupon Discount ({promoCode})</span>
                <span id="bill-discount" style={{ fontWeight: 700 }}>-${discount.toFixed(2)}</span>
              </div>
            )}

            {/* Total Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-color)',
                marginTop: '0.25rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>To Pay</span>
                <span id="bill-grand-total" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-orange)' }}>
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10B981' }}>
                <ShieldCheck size={14} />
                <span>Best price guaranteed</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              id="proceed-to-checkout-btn"
              onClick={() => navigate('/checkout')}
              className="btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
