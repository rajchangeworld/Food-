import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { CartProvider, useCart, VALID_PROMOS } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';

const wrapper = ({ children }) => (
  <ToastProvider>
    <CartProvider>{children}</CartProvider>
  </ToastProvider>
);

describe('Cart Calculations & Operations', () => {
  it('initializes with empty items or calculations', () => {
    localStorage.clear();
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.grandTotal).toBe(0);
  });

  it('adds items and calculates subtotal and fees correctly', () => {
    localStorage.clear();
    const { result } = renderHook(() => useCart(), { wrapper });

    const sampleBurger = {
      id: 'b1',
      name: 'Smoky Beast Burger',
      price: 10.0,
      image: 'burger.jpg',
      category: 'Burger',
    };

    act(() => {
      result.current.addToCart(sampleBurger, 2);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.subtotal).toBe(20.0);
    // Order < 35, so standard delivery fee 2.99 + 1.49 packaging
    expect(result.current.deliveryFee).toBe(2.99);
    expect(result.current.restaurantFee).toBe(1.49);
    expect(result.current.grandTotal).toBe(24.48);
  });

  it('updates quantity and removes item when quantity reaches zero', () => {
    localStorage.clear();
    const { result } = renderHook(() => useCart(), { wrapper });

    const item = { id: 'p1', name: 'Pizza', price: 15.0 };

    act(() => {
      result.current.addToCart(item, 2);
    });

    expect(result.current.items[0].quantity).toBe(2);

    act(() => {
      result.current.updateQuantity('p1', 3);
    });
    expect(result.current.items[0].quantity).toBe(3);

    act(() => {
      result.current.updateQuantity('p1', 0);
    });
    expect(result.current.items.length).toBe(0);
  });

  it('applies promo code TASTY50 and calculates discount', () => {
    localStorage.clear();
    const { result } = renderHook(() => useCart(), { wrapper });

    const item = { id: 'bir1', name: 'Dum Biryani', price: 20.0 };

    act(() => {
      result.current.addToCart(item, 1);
    });

    act(() => {
      const applied = result.current.applyPromo('TASTY50');
      expect(applied).toBe(true);
    });

    expect(result.current.promoCode).toBe('TASTY50');
    // 50% off $20 is $10 (capped at max $10)
    expect(result.current.discount).toBe(10.0);
    // subtotal (20) + delivery (2.99) + packaging (1.49) - 10 = 14.48
    expect(result.current.grandTotal).toBe(14.48);

    act(() => {
      result.current.removePromo();
    });
    expect(result.current.promoCode).toBe('');
    expect(result.current.discount).toBe(0);
  });
});
