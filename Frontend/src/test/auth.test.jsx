import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { CartProvider } from '../context/CartContext';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicOnlyRoute from '../components/PublicOnlyRoute';
import Login from '../pages/Login';
import VerifyOtp from '../pages/VerifyOtp';
import Profile from '../pages/Profile';
import { apiService, STORAGE_KEYS } from '../services/api';

// Helper component to test route protection
function MockHomeScreen() {
  return <div data-testid="home-screen">Welcome to CraveBite Home</div>;
}

describe('Authentication & Session Management Flows', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('1. First-Time App Opening & Validation', () => {
    it('redirects unauthenticated first-time users to Login', async () => {
      render(
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <MemoryRouter initialEntries={['/']}>
                <Routes>
                  <Route
                    path="/login"
                    element={<div data-testid="login-page">CraveBite Dedicated Login</div>}
                  />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <MockHomeScreen />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </MemoryRouter>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      );

      // Should redirect to /login and not show Home
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
      });
      expect(screen.queryByTestId('home-screen')).toBeNull();
    });

    it('renders Login page with Indian country code +91 and branding', () => {
      render(
        <ToastProvider>
          <AuthProvider>
            <MemoryRouter initialEntries={['/login']}>
              <Login />
            </MemoryRouter>
          </AuthProvider>
        </ToastProvider>
      );

      expect(screen.getByText('Crave')).toBeInTheDocument();
      expect(screen.getByText('Bite')).toBeInTheDocument();
      expect(screen.getByText('+91')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter 10-digit number/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
    });

    it('rejects invalid Indian mobile numbers with validation message', async () => {
      render(
        <ToastProvider>
          <AuthProvider>
            <MemoryRouter initialEntries={['/login']}>
              <Login />
            </MemoryRouter>
          </AuthProvider>
        </ToastProvider>
      );

      const phoneInput = screen.getByPlaceholderText(/Enter 10-digit number/i);
      const continueBtn = screen.getByRole('button', { name: /Continue/i });

      // Enter invalid number starting with '4' (Indian numbers start with 6,7,8,9)
      fireEvent.change(phoneInput, { target: { value: '4567890123' } });
      fireEvent.click(continueBtn);

      await waitFor(() => {
        expect(
          screen.getByText(/Please enter a valid 10-digit Indian mobile number/i)
        ).toBeInTheDocument();
      });
    });

    it('accepts valid Indian mobile number and requests OTP', async () => {
      const sendOtpSpy = vi.spyOn(apiService, 'sendOtp').mockResolvedValue({
        success: true,
        data: { phone: '+919876543210', expiresInSeconds: 300 },
      });

      render(
        <ToastProvider>
          <AuthProvider>
            <MemoryRouter initialEntries={['/login']}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/verify-otp" element={<div data-testid="otp-screen">OTP Screen</div>} />
              </Routes>
            </MemoryRouter>
          </AuthProvider>
        </ToastProvider>
      );

      const phoneInput = screen.getByPlaceholderText(/Enter 10-digit number/i);
      const continueBtn = screen.getByRole('button', { name: /Continue/i });

      fireEvent.change(phoneInput, { target: { value: '9876543210' } });
      fireEvent.click(continueBtn);

      await waitFor(() => {
        expect(sendOtpSpy).toHaveBeenCalledWith('+919876543210');
        expect(screen.getByTestId('otp-screen')).toBeInTheDocument();
      });
    });
  });

  describe('2. OTP Verification & Login State', () => {
    it('rejects incorrect or expired OTP with a clear error message', async () => {
      vi.spyOn(apiService, 'verifyOtp').mockRejectedValue(
        new Error('Invalid OTP code. Please check and try again.')
      );

      // Pre-set pending phone in context via helper
      function SetupHelper() {
        const { setPendingPhone, pendingPhone } = useAuth();
        React.useEffect(() => {
          setPendingPhone('+919876543210');
        }, [setPendingPhone]);
        if (!pendingPhone) return <div>Loading...</div>;
        return <VerifyOtp />;
      }

      render(
        <ToastProvider>
          <AuthProvider>
            <MemoryRouter initialEntries={['/verify-otp']}>
              <SetupHelper />
            </MemoryRouter>
          </AuthProvider>
        </ToastProvider>
      );

      // Enter 6 wrong digits
      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(6);

      inputs.forEach((input) => {
        fireEvent.change(input, { target: { value: '9' } });
      });

      const verifyBtn = screen.getByRole('button', { name: /Verify & Continue/i });
      fireEvent.click(verifyBtn);

      await waitFor(() => {
        expect(
          screen.getByText(/Invalid OTP code. Please check and try again./i)
        ).toBeInTheDocument();
      });
    });

    it('successfully logs the user in and saves session on valid OTP', async () => {
      const mockUser = {
        id: 'user_123',
        phone: '+919876543210',
        name: 'Rahul Sharma',
        role: 'customer',
        addresses: [],
      };

      vi.spyOn(apiService, 'verifyOtp').mockResolvedValue({
        success: true,
        data: {
          token: 'valid_jwt_token_999',
          user: mockUser,
        },
      });

      function SetupHelper() {
        const { setPendingPhone, pendingPhone } = useAuth();
        React.useEffect(() => {
          setPendingPhone('+919876543210');
        }, [setPendingPhone]);
        if (!pendingPhone) return <div>Loading...</div>;
        return <VerifyOtp />;
      }

      render(
        <ToastProvider>
          <AuthProvider>
            <MemoryRouter initialEntries={['/verify-otp']}>
              <Routes>
                <Route path="/verify-otp" element={<SetupHelper />} />
                <Route path="/" element={<MockHomeScreen />} />
              </Routes>
            </MemoryRouter>
          </AuthProvider>
        </ToastProvider>
      );

      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input, idx) => {
        fireEvent.change(input, { target: { value: String(idx + 1) } });
      });

      const verifyBtn = screen.getByRole('button', { name: /Verify & Continue/i });
      fireEvent.click(verifyBtn);

      await waitFor(() => {
        expect(screen.getByTestId('home-screen')).toBeInTheDocument();
        expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe('valid_jwt_token_999');
        expect(localStorage.getItem(STORAGE_KEYS.USER)).toContain('Rahul Sharma');
      });
    });
  });

  describe('3. Session Restoration & Expiration', () => {
    it('restores valid session on app refresh without asking for phone again', async () => {
      const existingUser = {
        id: 'usr_existing',
        phone: '+919876543210',
        name: 'Priya Patel',
      };

      localStorage.setItem(STORAGE_KEYS.TOKEN, 'persisted_jwt_token');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(existingUser));

      vi.spyOn(apiService, 'getMe').mockResolvedValue({
        success: true,
        user: existingUser,
      });

      render(
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <MemoryRouter initialEntries={['/']}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <MockHomeScreen />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
                </Routes>
              </MemoryRouter>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      );

      // Directly renders home
      await waitFor(() => {
        expect(screen.getByTestId('home-screen')).toBeInTheDocument();
      });
      expect(screen.queryByTestId('login-page')).toBeNull();
    });

    it('clears session and returns to login if token is expired or invalid', async () => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'expired_token');

      vi.spyOn(apiService, 'getMe').mockResolvedValue({
        success: false,
        error: 'Session expired',
      });

      render(
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <MemoryRouter initialEntries={['/']}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <MockHomeScreen />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<div data-testid="login-page">Login Screen</div>} />
                </Routes>
              </MemoryRouter>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
        expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
      });
    });
  });

  describe('4. Logout Flow & Protected Routes', () => {
    it('shows confirmation dialog on clicking logout and clears session on confirm', async () => {
      const currentUser = {
        id: 'user_active',
        name: 'Amit Kumar',
        phone: '+919876543210',
        email: 'amit@example.com',
        addresses: [],
      };

      localStorage.setItem(STORAGE_KEYS.TOKEN, 'user_token');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      // Save some orders to verify order history is not deleted
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([{ id: 'CRV-1001', total: 25.5 }]));

      vi.spyOn(apiService, 'fetchUserProfile').mockResolvedValue({
        data: currentUser,
      });
      const logoutSpy = vi.spyOn(apiService, 'logout').mockResolvedValue();

      render(
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <MemoryRouter initialEntries={['/profile']}>
                <Routes>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<div data-testid="login-screen">Login Screen</div>} />
                </Routes>
              </MemoryRouter>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      );

      // Open logout confirmation dialog
      await waitFor(() => {
        expect(screen.getByText('Amit Kumar')).toBeInTheDocument();
      });

      const logoutBtn = screen.getByRole('button', { name: /Log Out/i });
      fireEvent.click(logoutBtn);

      // Check confirmation message
      expect(screen.getByText('Are you sure you want to log out?')).toBeInTheDocument();

      // Click confirm 'Log Out'
      const confirmBtns = screen.getAllByRole('button', { name: /Log Out/i });
      const dialogConfirmBtn = confirmBtns[confirmBtns.length - 1];
      fireEvent.click(dialogConfirmBtn);

      await waitFor(() => {
        expect(logoutSpy).toHaveBeenCalled();
        expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
        expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
        expect(screen.getByTestId('login-screen')).toBeInTheDocument();
      });

      // Verify orders are NOT deleted
      const preservedOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS));
      expect(preservedOrders).toHaveLength(1);
      expect(preservedOrders[0].id).toBe('CRV-1001');
    });

    it('blocks access to protected routes after logout', async () => {
      // User is logged out
      localStorage.clear();

      render(
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <MemoryRouter initialEntries={['/cart']}>
                <Routes>
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <div data-testid="cart-screen">Cart Screen</div>
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<div data-testid="login-screen">Login Screen</div>} />
                </Routes>
              </MemoryRouter>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('login-screen')).toBeInTheDocument();
      });
      expect(screen.queryByTestId('cart-screen')).toBeNull();
    });

    it('displays logged-in phone number as locked and read-only in Edit Profile', async () => {
      const loggedInUser = {
        id: 'usr_locked_101',
        name: 'Rohan Gupta',
        phone: '+919988776655',
        email: 'rohan@example.com',
        addresses: [],
      };

      localStorage.setItem(STORAGE_KEYS.TOKEN, 'sample_token');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedInUser));

      vi.spyOn(apiService, 'fetchUserProfile').mockResolvedValue({
        data: loggedInUser,
      });

      render(
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <MemoryRouter initialEntries={['/profile']}>
                <Profile />
              </MemoryRouter>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      );

      // Verify logged in phone number appears on profile card
      await waitFor(() => {
        expect(screen.getByText('+919988776655')).toBeInTheDocument();
      });

      // Click Edit Profile button
      const editBtn = screen.getByRole('button', { name: /Edit Profile/i });
      fireEvent.click(editBtn);

      // Verify modal opened and phone input is readOnly & disabled with locked badge
      expect(screen.getByText(/Registered & Locked/i)).toBeInTheDocument();
      const phoneInput = screen.getByDisplayValue('+919988776655');
      expect(phoneInput).toBeInTheDocument();
      expect(phoneInput).toHaveAttribute('readonly');
      expect(phoneInput).toBeDisabled();
    });
  });
});
