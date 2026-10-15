import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { CheckCircle2, Clock, MapPin, ArrowRight, Home, Bike, Receipt } from 'lucide-react';

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order && id) {
      async function fetchDetails() {
        setLoading(true);
        const res = await apiService.fetchOrderById(id);
        if (res.data) {
          setOrder(res.data);
        }
        setLoading(false);
      }
      fetchDetails();
    }
  }, [id, order]);

  return (
    <div
      className="animate-fade-in"
      style={{
        maxWidth: '640px',
        margin: '0 auto',
        padding: '2rem 1rem calc(var(--bottom-nav-height) + 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.5rem',
      }}
    >
      {/* Animated Checkmark Icon */}
      <div
        style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '3px solid #10B981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.35)',
          animation: 'pulseGlow 2.5s infinite',
        }}
      >
        <CheckCircle2 size={48} color="#10B981" strokeWidth={2.5} />
      </div>

      {/* Confirmation text */}
      <div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          Order Confirmed!
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Thank you for choosing CraveBite. The restaurant has accepted your order and is starting preparation.
        </p>
      </div>

      {/* Order Details Card */}
      <div
        style={{
          width: '100%',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          textAlign: 'left',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Order Reference
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-orange)' }}>
              #{id || order?.id || 'CRV-CONFIRMED'}
            </h3>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Paid
            </span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
              ${order?.total ? Number(order.total).toFixed(2) : '--'}
            </div>
          </div>
        </div>

        {/* Estimated delivery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
          <Clock size={20} color="var(--primary-orange)" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Estimated Arrival Time</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>
              25 - 35 Minutes (Around {new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
            </span>
          </div>
        </div>

        {/* Destination address */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <MapPin size={20} color="var(--secondary-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Delivering to</span>
            <span style={{ fontSize: '0.88rem', color: '#FFFFFF', fontWeight: 500 }}>
              {typeof order?.deliveryAddress === 'string'
                ? order.deliveryAddress
                : order?.deliveryAddress?.street || '42 Marine Drive, Apt 4B'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%', justifyContent: 'center' }}>
        <Link
          to={`/track-order/${id || order?.id || 'CRV-9241'}`}
          id="track-live-order-btn"
          className="btn-primary"
          style={{ flex: 1, minWidth: '200px', padding: '0.85rem 1.5rem' }}
        >
          <Bike size={18} />
          <span>Track Order Status</span>
        </Link>

        <Link
          to="/"
          id="continue-shopping-btn"
          className="btn-secondary"
          style={{ flex: 1, minWidth: '200px', padding: '0.85rem 1.5rem' }}
        >
          <Home size={18} />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}
