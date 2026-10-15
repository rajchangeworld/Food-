import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, STORAGE_KEYS } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEYS.TOKEN) || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingPhone, setPendingPhoneState] = useState(
    () => sessionStorage.getItem('cravebite_pending_phone') || ''
  );
  const [latestDevOtp, setLatestDevOtpState] = useState(
    () => sessionStorage.getItem('cravebite_dev_otp') || ''
  );

  function setPendingPhone(phone) {
    if (phone) {
      sessionStorage.setItem('cravebite_pending_phone', phone);
    } else {
      sessionStorage.removeItem('cravebite_pending_phone');
    }
    setPendingPhoneState(phone);
  }

  function setLatestDevOtp(otp) {
    if (otp) {
      sessionStorage.setItem('cravebite_dev_otp', otp);
    } else {
      sessionStorage.removeItem('cravebite_dev_otp');
    }
    setLatestDevOtpState(otp);
  }

  // Validate existing session on application launch
  useEffect(() => {
    async function validateSession() {
      const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (!savedToken) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const res = await apiService.getMe();
        if (res.success && res.user) {
          setUser(res.user);
          setIsAuthenticated(true);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));
        } else {
          // Token expired or invalid
          clearSession();
        }
      } catch (err) {
        // If saved user exists and token is present, fall back to offline user or clear
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          } catch {
            clearSession();
          }
        } else {
          clearSession();
        }
      } finally {
        setIsLoading(false);
      }
    }

    validateSession();
  }, []);

  function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }

  /**
   * Request OTP for a phone number
   */
  async function requestOtp(phoneNumber) {
    const res = await apiService.sendOtp(phoneNumber);
    if (res.success) {
      setPendingPhone(phoneNumber);
      if (res.data?.devOtp) {
        setLatestDevOtp(res.data.devOtp);
      } else if (res.isMock) {
        setLatestDevOtp('123456');
      }
      return res;
    }
    throw new Error(res.message || 'Failed to send OTP');
  }

  /**
   * Verify OTP and complete login
   */
  async function completeOtpVerification(otpCode) {
    if (!pendingPhone) {
      throw new Error('No pending login session found. Please enter your mobile number again.');
    }

    const res = await apiService.verifyOtp(pendingPhone, otpCode);
    if (res.success && res.data) {
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem(STORAGE_KEYS.TOKEN, receivedToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      setIsAuthenticated(true);
      setLatestDevOtp('');
      return { success: true, user: receivedUser };
    }
    throw new Error(res.message || 'OTP verification failed');
  }

  /**
   * Logout user, clear session, and revoke credentials
   */
  async function logout() {
    try {
      await apiService.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      clearSession();
      setPendingPhone('');
      setLatestDevOtp('');
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        pendingPhone,
        setPendingPhone,
        latestDevOtp,
        setLatestDevOtp,
        requestOtp,
        verifyOtp: completeOtpVerification,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
