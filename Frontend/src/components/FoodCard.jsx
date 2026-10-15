import React from 'react';
import { Star, Plus, Minus, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FoodCard({ food, onClickDetails }) {
  const { items, addToCart, updateQuantity } = useCart();

  // Find if this item is currently in cart
  const cartItem = items.find((i) => i.id === food.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(food, 1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    updateQuantity(food.id, quantity + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQuantity(food.id, quantity - 1);
  };

  return (
    <article
      id={`food-card-${food.id}`}
      onClick={() => onClickDetails && onClickDetails(food)}
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        padding: '0',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Food Image Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '62%', overflow: 'hidden', backgroundColor: '#1a1a1a' }}>
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          className="food-img"
        />

        {/* Veg / Non-Veg Indicator */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(17, 17, 17, 0.85)',
            backdropFilter: 'blur(4px)',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
          title={food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
        >
          <div className={`diet-indicator ${food.isVeg ? 'veg' : 'non-veg'}`}>
            <div className="diet-dot" />
          </div>
        </div>

        {/* Rating Badge */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(17, 17, 17, 0.85)',
            backdropFilter: 'blur(4px)',
            color: '#FFFFFF',
            padding: '4px 8px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Star size={12} fill="#F59E0B" color="#F59E0B" />
          <span>{food.rating}</span>
        </div>

        {/* Prep Time pill */}
        {food.prepTime && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '10px',
              backgroundColor: 'rgba(11, 11, 11, 0.75)',
              backdropFilter: 'blur(4px)',
              color: 'var(--text-secondary)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.7rem',
              fontWeight: 500,
            }}
          >
            <Clock size={11} color="var(--primary-orange)" />
            <span>{food.prepTime}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {food.name}
            </h3>
          </div>

          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              marginBottom: '1rem',
              minHeight: '2.25rem',
            }}
          >
            {food.description}
          </p>
        </div>

        {/* Bottom row: Price and Add button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Price</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-orange)' }}>
              ${Number(food.price).toFixed(2)}
            </span>
          </div>

          {/* Quantity Controls / Add Button */}
          {quantity > 0 ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--primary-orange)',
                padding: '2px',
                gap: '8px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                id={`decrement-${food.id}`}
                onClick={handleDecrement}
                aria-label={`Decrease quantity of ${food.name}`}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  color: 'var(--primary-orange)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                <Minus size={14} />
              </button>
              <span
                id={`qty-count-${food.id}`}
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  minWidth: '16px',
                  textAlign: 'center',
                }}
              >
                {quantity}
              </span>
              <button
                type="button"
                id={`increment-${food.id}`}
                onClick={handleIncrement}
                aria-label={`Increase quantity of ${food.name}`}
                style={{
                  width: '28px',
                  height: '28px',
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
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              id={`add-to-cart-${food.id}`}
              onClick={handleAdd}
              aria-label={`Add ${food.name} to cart`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--orange-subtle)',
                color: 'var(--primary-orange)',
                border: '1px solid var(--primary-orange)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              className="add-btn-hover"
            >
              <Plus size={15} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
      <style>{`
        #food-card-${food.id}:hover .food-img {
          transform: scale(1.04);
        }
        .add-btn-hover:hover {
          background-color: var(--primary-orange) !important;
          color: #FFFFFF !important;
        }
      `}</style>
    </article>
  );
}
