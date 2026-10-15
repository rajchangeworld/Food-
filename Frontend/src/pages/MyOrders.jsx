import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import OrderCard from '../components/OrderCard';
import { OrderCardSkeleton } from '../components/LoadingSkeleton';
import { ClipboardList, RotateCcw, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed'
  const [isMockData, setIsMockData] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.fetchOrders();
      setOrders(res.data || []);
      setIsMockData(res.isMock);
    } catch (err) {
      setError('Unable to load orders at this moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const isDelivered = order.status?.toLowerCase() === 'delivered';
    if (activeTab === 'active') return !isDelivered;
    if (activeTab === 'completed') return isDelivered;
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>
            My Orders
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Track your ongoing deliveries and view past meal history
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="btn-secondary"
          style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}
          disabled={loading}
        >
          <RotateCcw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Demo status banner if in mock mode */}
      {isMockData && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            backgroundColor: 'rgba(255, 107, 0, 0.08)',
            border: '1px solid rgba(255, 107, 0, 0.25)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
          }}
        >
          <Sparkles size={16} color="var(--primary-orange)" style={{ flexShrink: 0 }} />
          <span>
            <strong style={{ color: 'var(--primary-orange)' }}>Demo Orders Mode:</strong> Showing interactive sample orders stored locally. Real backend orders will seamlessly display once your backend server starts.
          </span>
        </div>
      )}

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem',
        }}
        role="tablist"
      >
        {[
          { key: 'all', label: 'All Orders' },
          { key: 'active', label: 'Active Orders' },
          { key: 'completed', label: 'Past Orders' },
        ].map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              id={`orders-tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.5rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: isSelected ? 700 : 500,
                backgroundColor: isSelected ? 'var(--primary-orange)' : 'transparent',
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                border: isSelected ? '1px solid var(--primary-orange)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content States */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      ) : error ? (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid #EF4444',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <AlertTriangle size={36} color="#EF4444" />
          <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 700 }}>Something went wrong</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{error}</p>
          <button type="button" onClick={loadOrders} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-input)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <ClipboardList size={34} strokeWidth={1.5} color="var(--primary-orange)" />
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>
              No orders found
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '340px' }}>
              {activeTab === 'active'
                ? 'You do not have any orders currently out for delivery.'
                : 'You have not placed any orders yet. Treat yourself to a delicious meal today!'}
            </p>
          </div>

          <Link to="/" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            <span>Order Food Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
