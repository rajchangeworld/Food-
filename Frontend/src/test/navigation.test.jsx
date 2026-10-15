import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { CartProvider } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';

describe('BottomNavigation Component', () => {
  it('renders all four main tabs with accessible labels', () => {
    render(
      <ToastProvider>
        <CartProvider>
          <MemoryRouter initialEntries={['/']}>
            <BottomNavigation />
          </MemoryRouter>
        </CartProvider>
      </ToastProvider>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('My Orders')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('hides bottom navigation on checkout route', () => {
    const { container } = render(
      <ToastProvider>
        <CartProvider>
          <MemoryRouter initialEntries={['/checkout']}>
            <BottomNavigation />
          </MemoryRouter>
        </CartProvider>
      </ToastProvider>
    );

    expect(container.querySelector('.bottom-navigation-container')).toBeNull();
  });
});
