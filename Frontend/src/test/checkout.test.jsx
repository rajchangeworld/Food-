import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Checkout from '../pages/Checkout';
import { CartContext } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';

describe('Checkout Component Validations', () => {
  it('displays empty cart state if items array is empty', () => {
    const mockCartValue = {
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      restaurantFee: 0,
      discount: 0,
      grandTotal: 0,
      promoCode: '',
      selectedAddress: null,
      clearCart: () => {},
    };

    render(
      <ToastProvider>
        <CartContext.Provider value={mockCartValue}>
          <MemoryRouter initialEntries={['/checkout']}>
            <Checkout />
          </MemoryRouter>
        </CartContext.Provider>
      </ToastProvider>
    );

    expect(screen.getByText('No items to checkout')).toBeInTheDocument();
  });

  it('validates required fields on submission', () => {
    const mockCartValue = {
      items: [{ id: 'b1', name: 'Burger', price: 10, quantity: 1 }],
      subtotal: 10,
      deliveryFee: 2.99,
      restaurantFee: 1.49,
      discount: 0,
      grandTotal: 14.48,
      promoCode: '',
      selectedAddress: { tag: 'Home', street: '123 Main St', city: 'Metro' },
      clearCart: () => {},
    };

    const { container } = render(
      <ToastProvider>
        <CartContext.Provider value={mockCartValue}>
          <MemoryRouter initialEntries={['/checkout']}>
            <Checkout />
          </MemoryRouter>
        </CartContext.Provider>
      </ToastProvider>
    );

    // Clear name field
    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    // Submit form
    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(screen.getByText(/Please enter your full name/i)).toBeInTheDocument();
  });
});
