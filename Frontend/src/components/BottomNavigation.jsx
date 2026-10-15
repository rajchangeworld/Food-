import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ClipboardList, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BottomNavigation() {
  const { totalCount } = useCart();
  const location = useLocation();

  // Hide bottom nav on specific standalone flows if desired, or keep it accessible:
  // The user prompt says:
  // "Checkout, order confirmation, and order tracking should be separate routes outside the four main tabs.
  // They should open from the relevant actions and retain the bottom navigation behavior only where appropriate."
  const isCheckout = location.pathname === '/checkout';

  if (isCheckout) {
    return null; // Keep checkout focused and distraction-free
  }

  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Cart', path: '/cart', icon: ShoppingBag, badge: totalCount },
    { name: 'My Orders', path: '/orders', icon: ClipboardList },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav
      className="bottom-navigation-container"
      role="navigation"
      aria-label="Bottom Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        backgroundColor: 'rgba(17, 17, 17, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-color)',
        paddingBottom: 'var(--safe-bottom)',
        boxShadow: '0 -4px 25px rgba(0, 0, 0, 0.6)',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 'var(--bottom-nav-height)',
          padding: '0 0.5rem',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(tab.path);

          return (
            <NavLink
              key={tab.name}
              to={tab.path}
              id={`nav-tab-${tab.name.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                height: '100%',
                padding: '4px 0',
                color: isActive ? 'var(--primary-orange)' : 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '32px',
                  borderRadius: '16px',
                  backgroundColor: isActive ? 'var(--orange-subtle)' : 'transparent',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                  transform: isActive ? 'scale(1.06)' : 'scale(1)',
                }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  color={isActive ? 'var(--primary-orange)' : 'var(--text-secondary)'}
                />
                {tab.badge > 0 && (
                  <span
                    id="cart-badge-count"
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '2px',
                      background: 'var(--primary-orange)',
                      color: '#FFFFFF',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      minWidth: '16px',
                      height: '16px',
                      padding: '0 4px',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(255, 107, 0, 0.8)',
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: isActive ? 700 : 500,
                  marginTop: '2px',
                  letterSpacing: '0.01em',
                  color: isActive ? 'var(--primary-orange)' : 'var(--text-secondary)',
                }}
              >
                {tab.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
