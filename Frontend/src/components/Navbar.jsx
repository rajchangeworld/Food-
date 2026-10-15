import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, ShoppingBag, Flame, ChevronDown, Check, Wifi, WifiOff } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { DEFAULT_USER_PROFILE } from '../data/mockMenu';
import { apiService } from '../services/api';

export default function Navbar() {
  const { totalCount, selectedAddress, setSelectedAddress } = useCart();
  const location = useLocation();
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  const isLive = apiService.isLive();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(11, 11, 11, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.75rem 1rem',
      transition: 'all 0.2s ease',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand / Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(255, 107, 0, 0.4)'
          }}>
            <Flame size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#FFFFFF' }}>Crave</span>
              <span style={{ color: 'var(--primary-orange)' }}>Bite</span>
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginTop: '-2px' }}>
              Fresh & Fast
            </span>
          </div>
        </Link>

        {/* Location Selector (Interactive) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowAddressDropdown(!showAddressDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '9999px',
              color: 'var(--text-primary)',
              maxWidth: '240px',
              textAlign: 'left'
            }}
            title="Change Delivery Location"
            aria-label="Delivery location selector"
          >
            <MapPin size={16} color="var(--primary-orange)" style={{ flexShrink: 0 }} />
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', lineHeight: 1 }}>Deliver to</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                {selectedAddress ? `${selectedAddress.tag} • ${selectedAddress.street.split(',')[0]}` : 'Select Address'}
              </span>
            </div>
            <ChevronDown size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
          </button>

          {/* Address Dropdown Modal/Menu */}
          {showAddressDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              width: '280px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '10px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 101,
              animation: 'fadeIn 0.15s ease'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', padding: '6px 8px', letterSpacing: '0.05em' }}>
                Saved Locations
              </div>
              {DEFAULT_USER_PROFILE.addresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <button
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setShowAddressDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: isSelected ? 'var(--orange-subtle)' : 'transparent',
                      border: isSelected ? '1px solid rgba(255,107,0,0.3)' : '1px solid transparent',
                      color: '#FFFFFF',
                      textAlign: 'left',
                      marginBottom: '4px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? 'var(--primary-orange)' : '#FFFFFF' }}>
                        {addr.tag}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '210px' }}>
                        {addr.street}
                      </div>
                    </div>
                    {isSelected && <Check size={16} color="var(--primary-orange)" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right side: Desktop Nav & Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Status Indicator */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: isLive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 107, 0, 0.1)',
              border: `1px solid ${isLive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 107, 0, 0.3)'}`,
              color: isLive ? '#10B981' : 'var(--secondary-orange)',
            }}
            className="api-status-pill"
          >
            {isLive ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>{isLive ? 'API Connected' : 'Demo Mode'}</span>
          </div>

          {/* Desktop links */}
          <nav className="desktop-nav-links" style={{ display: 'none', alignItems: 'center', gap: '1.25rem' }}>
            <Link
              to="/"
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: location.pathname === '/' ? 'var(--primary-orange)' : 'var(--text-secondary)',
                transition: 'color 0.15s ease'
              }}
            >
              Home
            </Link>
            <Link
              to="/orders"
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: location.pathname.startsWith('/orders') || location.pathname.startsWith('/track-order') ? 'var(--primary-orange)' : 'var(--text-secondary)',
                transition: 'color 0.15s ease'
              }}
            >
              My Orders
            </Link>
            <Link
              to="/profile"
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: location.pathname === '/profile' ? 'var(--primary-orange)' : 'var(--text-secondary)',
                transition: 'color 0.15s ease'
              }}
            >
              Profile
            </Link>
          </nav>

          {/* Cart Icon Button */}
          <Link
            to="/cart"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: location.pathname === '/cart' ? 'var(--orange-subtle)' : 'var(--bg-input)',
              border: location.pathname === '/cart' ? '1px solid var(--primary-orange)' : '1px solid var(--border-color)',
              color: location.pathname === '/cart' ? 'var(--primary-orange)' : '#FFFFFF',
              transition: 'all 0.15s ease',
            }}
            aria-label={`Cart with ${totalCount} items`}
          >
            <ShoppingBag size={20} />
            {totalCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--primary-orange)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(255, 107, 0, 0.6)',
                  animation: 'pulseGlow 2s infinite'
                }}
              >
                {totalCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav-links {
            display: flex !important;
          }
          .api-status-pill {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
