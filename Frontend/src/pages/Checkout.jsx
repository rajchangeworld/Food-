import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/api';
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  CreditCard,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

export default function Checkout() {
  const {
    items,
    subtotal,
    deliveryFee,
    restaurantFee,
    discount,
    grandTotal,
    promoCode,
    selectedAddress,
    clearCart,
  } = useCart();

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form fields
  const [name, setName] = useState('Alex Johnson');
  const [phone, setPhone] = useState('+1 (555) 382-9012');
  const [deliveryAddress, setDeliveryAddress] = useState(
    selectedAddress ? `${selectedAddress.tag}: ${selectedAddress.street}, ${selectedAddress.city}` : '42 Marine Drive, Apt 4B, Downtown Metro'
  );
  const [deliveryInstructions, setDeliveryInstructions] = useState('Please leave package at the door and ring doorbell');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'cod'

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // If user visits checkout with an empty cart, redirect back to cart
  if (items.length === 0) {
    return (
      <div
        className="animate-fade-in"
        style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
          No items to checkout
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Please add dishes to your cart before proceeding to checkout.
        </p>
        <Link to="/" className="btn-primary">
          Back to Menu
        </Link>
      </div>
    );
  }

  const validatePhone = (val) => {
    // Basic phone validation: digits, spaces, parentheses, dashes, min 8 chars
    const cleaned = val.replace(/\D/g, '');
    return cleaned.length >= 7;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError('');

    // Field validations
    if (!name.trim()) {
      setFormError('Please enter your full name');
      showToast('Name is required', 'error');
      return;
    }

    if (!phone.trim() || !validatePhone(phone)) {
      setFormError('Please enter a valid phone number (at least 7 digits)');
      showToast('Valid phone number is required', 'error');
      return;
    }

    if (!deliveryAddress.trim()) {
      setFormError('Please enter the delivery address');
      showToast('Delivery address is required', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: name.trim(),
        customerPhone: phone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        deliveryInstructions: deliveryInstructions.trim(),
        paymentMethod,
        items,
        subtotal,
        deliveryFee,
        restaurantFee,
        discount,
        promoCode,
        total: grandTotal,
      };

      const res = await apiService.createOrder(orderPayload);
      const createdOrder = res.data;

      // Clear the cart
      clearCart();

      showToast('Order placed successfully!', 'success');

      // Navigate to order confirmation
      navigate(`/order-confirmation/${createdOrder.id}`, { state: { order: createdOrder } });
    } catch (err) {
      setFormError('Failed to place order. Please check connection and try again.');
      showToast('Order failed. Please retry.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="btn-icon"
          aria-label="Back to Cart"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>
            Secure Checkout
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Complete your delivery & payment details
          </p>
        </div>
      </div>

      {formError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #EF4444',
            borderRadius: 'var(--radius-md)',
            color: '#FFFFFF',
            fontSize: '0.88rem',
          }}
        >
          <AlertCircle size={18} color="#EF4444" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Form and Summary Grid */}
      <form
        onSubmit={handlePlaceOrder}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column: Delivery Details & Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Customer & Address Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--primary-orange)" />
              <span>Contact & Delivery Address</span>
            </h3>

            {/* Name */}
            <div>
              <label htmlFor="checkout-name" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                id="checkout-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                style={{ width: '100%' }}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="checkout-phone" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Phone Number (for rider updates) *
              </label>
              <input
                id="checkout-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={{ width: '100%' }}
                required
              />
            </div>

            {/* Full Address */}
            <div>
              <label htmlFor="checkout-address" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Complete Delivery Address *
              </label>
              <textarea
                id="checkout-address"
                rows={3}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="House / Flat no., Street, Area, Landmark"
                style={{ width: '100%', resize: 'vertical' }}
                required
              />
            </div>

            {/* Instructions */}
            <div>
              <label htmlFor="checkout-instructions" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Delivery Instructions (Optional)
              </label>
              <input
                id="checkout-instructions"
                type="text"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="e.g. Leave with security / Ring doorbell"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={18} color="var(--primary-orange)" />
              <span>Select Payment Method</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'card', name: 'Credit or Debit Card', desc: 'Instant Visa, Mastercard, AMEX', icon: CreditCard },
                { id: 'upi', name: 'Digital Wallet / UPI', desc: 'Google Pay, Apple Pay, PayPal', icon: Sparkles },
                { id: 'cod', name: 'Cash on Delivery', desc: 'Pay safely upon receipt of meal', icon: DollarSign },
              ].map((pm) => {
                const isSelected = paymentMethod === pm.id;
                const Icon = pm.icon;
                return (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--orange-subtle)' : 'var(--bg-input)',
                      border: isSelected ? '1px solid var(--primary-orange)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? 'var(--primary-orange)' : 'var(--bg-surface-elevated)',
                          color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF', display: 'block' }}>
                          {pm.name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {pm.desc}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? 'var(--primary-orange)' : '#444'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-orange)' }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--primary-orange)" />
              <span>Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
            </h3>

            {/* Items review */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.quantity}x {item.name}
                      </span>
                      {item.selectedOptions?.length > 0 && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          +{item.selectedOptions.map((o) => o.name).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', flexShrink: 0 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Delivery Charge</span>
                <span style={{ color: deliveryFee === 0 ? '#10B981' : '#FFFFFF' }}>
                  {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Packaging & Taxes</span>
                <span>${restaurantFee.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#10B981' }}>
                  <span>Coupon Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--primary-orange)' }}>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Guaranteed Delivery Notice */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <Clock size={16} color="var(--primary-orange)" />
              <span>Estimated Delivery: <strong>25 - 35 mins</strong></span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="place-order-button"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: '100%', padding: '0.95rem', fontSize: '1.05rem', marginTop: '0.5rem' }}
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>Place Order • ${grandTotal.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
