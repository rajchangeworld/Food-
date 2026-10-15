import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  Bike,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Wifi,
  WifiOff,
  ShoppingBag
} from 'lucide-react';

const ORDER_STAGES = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('Order Received');
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      try {
        const res = await apiService.fetchOrderById(id);
        if (res.data) {
          setOrder(res.data);
          setCurrentStatus(res.data.status || 'Order Received');
        }
        setIsMock(res.isMock);
      } catch (err) {
        showToast('Unable to load order details', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, showToast]);

  // Demo tool: advance stage to test timeline transitions
  const handleAdvanceStage = () => {
    const currentIndex = ORDER_STAGES.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % ORDER_STAGES.length;
    const nextStatus = ORDER_STAGES[nextIndex];
    setCurrentStatus(nextStatus);

    // Update local order object
    if (order) {
      setOrder({ ...order, status: nextStatus });
    }
    showToast(`Order status updated to "${nextStatus}" (Demo simulation)`, 'info');
  };

  const isLive = apiService.isLive();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading order tracking details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>Order not found</h3>
        <Link to="/orders" className="btn-primary">
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '720px', margin: '0 auto', paddingBottom: 'calc(var(--bottom-nav-height) + 2rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="btn-icon"
            aria-label="Back to Orders"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
              Order Tracking
            </h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-orange)', fontWeight: 700 }}>
              #{order.id}
            </span>
          </div>
        </div>

        {/* Live / Demo Mode indicator badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 107, 0, 0.15)',
            border: `1px solid ${isLive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 107, 0, 0.3)'}`,
            color: isLive ? '#10B981' : 'var(--secondary-orange)',
          }}
        >
          {isLive ? <Wifi size={13} /> : <WifiOff size={13} />}
          <span>{isLive ? 'Live Tracking API' : 'Demo Mode (Simulated)'}</span>
        </div>
      </div>

      {/* Status Progress Hero Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Current Delivery Status
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-orange)' }}>
              {currentStatus}
            </h2>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-full)',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <Clock size={15} color="var(--primary-orange)" />
            <span>ETA: {currentStatus === 'Delivered' ? 'Completed' : '15-20 mins'}</span>
          </div>
        </div>

        {/* Visual Timeline Component */}
        <OrderStatusTimeline
          currentStatus={currentStatus}
          timelineData={order.timeline || []}
        />

        {/* Demo Stage Advance Tool */}
        {!isLive && (
          <div
            style={{
              padding: '0.85rem',
              backgroundColor: 'rgba(255, 107, 0, 0.08)',
              border: '1px dashed rgba(255, 107, 0, 0.3)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <Sparkles size={14} color="var(--primary-orange)" />
              <span>Interactive Demo: Test next order stage</span>
            </div>
            <button
              type="button"
              id="advance-tracking-stage-btn"
              onClick={handleAdvanceStage}
              className="btn-outline"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
            >
              Advance to Next Status &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Delivery Partner Card */}
      {order.deliveryPartner && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--orange-subtle)',
                border: '1px solid var(--primary-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-orange)',
                flexShrink: 0,
              }}
            >
              <Bike size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {order.deliveryPartner.name}
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 700 }}>
                  ★ {order.deliveryPartner.rating}
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Riding: {order.deliveryPartner.vehicle}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => showToast(`Calling rider: ${order.deliveryPartner.phone}`, 'info')}
            className="btn-secondary"
            style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
          >
            <Phone size={14} color="var(--primary-orange)" />
            <span>Call Rider</span>
          </button>
        </div>
      )}

      {/* Delivery Address & Order Items Summary */}
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
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <MapPin size={18} color="var(--primary-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Delivery Location</span>
            <p style={{ fontSize: '0.88rem', color: '#FFFFFF', fontWeight: 500 }}>
              {typeof order.deliveryAddress === 'string'
                ? order.deliveryAddress
                : order.deliveryAddress?.street || '42 Marine Drive, Apt 4B'}
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Items in this delivery</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-orange)' }}>
              ${Number(order.total || 0).toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(order.items || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {item.quantity}x {item.name}
                </span>
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>
                  ${(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
