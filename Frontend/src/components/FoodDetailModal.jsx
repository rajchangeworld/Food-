import React, { useState } from 'react';
import { X, Star, Clock, Flame, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FoodDetailModal({ food, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);

  if (!food) return null;

  const toggleOption = (option) => {
    if (selectedOptions.some((o) => o.name === option.name)) {
      setSelectedOptions(selectedOptions.filter((o) => o.name !== option.name));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const optionsTotal = selectedOptions.reduce((acc, opt) => acc + (opt.price || 0), 0);
  const unitPrice = (food.price || 0) + optionsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(food, quantity, selectedOptions);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Hero Image */}
        <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
          <img
            src={food.image}
            alt={food.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80px',
              background: 'linear-gradient(to top, var(--bg-card), transparent)',
            }}
          />
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div className={`diet-indicator ${food.isVeg ? 'veg' : 'non-veg'}`}>
                <div className="diet-dot" />
              </div>
              <span style={{ fontSize: '0.8rem', color: food.isVeg ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                {food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
              <span style={{ color: 'var(--border-color)' }}>•</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{food.category}</span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25 }}>
              {food.name}
            </h2>

            {/* Badges row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700, color: '#F59E0B' }}>
                <Star size={15} fill="#F59E0B" />
                <span>{food.rating}</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({food.reviewsCount} reviews)</span>
              </div>
              {food.prepTime && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <Clock size={15} color="var(--primary-orange)" />
                  <span>{food.prepTime}</span>
                </div>
              )}
              {food.calories && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <Flame size={15} color="var(--secondary-orange)" />
                  <span>{food.calories}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {food.description}
          </p>

          {/* Ingredients */}
          {food.ingredients && food.ingredients.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Key Ingredients
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {food.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.78rem',
                      padding: '4px 10px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-full)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Customization Options */}
          {food.options && food.options.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Custom Add-ons
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {food.options.map((opt, i) => {
                  const isChecked = selectedOptions.some((o) => o.name === opt.name);
                  return (
                    <div
                      key={i}
                      onClick={() => toggleOption(opt)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: isChecked ? 'var(--orange-subtle)' : 'var(--bg-input)',
                        border: isChecked ? '1px solid var(--primary-orange)' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '6px',
                            border: `2px solid ${isChecked ? 'var(--primary-orange)' : '#444'}`,
                            backgroundColor: isChecked ? 'var(--primary-orange)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isChecked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>{opt.name}</span>
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-orange)' }}>
                        +${opt.price.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              marginTop: '0.5rem',
            }}
          >
            {/* Quantity Stepper */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                padding: '4px',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', minWidth: '20px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-orange)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              id="modal-add-to-cart-button"
              onClick={handleAddToCart}
              className="btn-primary"
              style={{ flex: 1, padding: '0.85rem 1.25rem', fontSize: '0.95rem' }}
            >
              <ShoppingBag size={18} />
              <span>Add to Cart • ${totalPrice.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
