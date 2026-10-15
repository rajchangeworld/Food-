import { MOCK_MENU, MOCK_ORDERS, DEFAULT_USER_PROFILE } from '../data/mockMenu';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const TIMEOUT_MS = 3500;

// Local storage keys for session and data persistence
export const STORAGE_KEYS = {
  TOKEN: 'cravebite_token',
  USER: 'cravebite_user',
  ORDERS: 'cravebite_orders',
  PROFILE: 'cravebite_profile',
  MENU: 'cravebite_menu',
};

// State flag to track whether live backend is active
let isLiveBackend = false;

// Helper to get auth headers from local storage
function getAuthHeaders() {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper to fetch with timeout
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {}),
    };
    const response = await fetch(url, { ...options, headers, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Initialize mock storage if not present
function initializeMockStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(MOCK_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
  }
}

initializeMockStorage();

export const apiService = {
  getBaseUrl() {
    return API_BASE_URL;
  },

  isLive() {
    return isLiveBackend;
  },

  /**
   * Request OTP for mobile number
   */
  async sendOtp(phone) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      isLiveBackend = true;
      return { success: true, data };
    } catch (err) {
      // In offline/mock fallback mode
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('abort')) {
        throw err;
      }
      // Demo mock fallback if server unreachable
      return {
        success: true,
        data: {
          phone,
          expiresInSeconds: 300,
          mode: 'development',
          message: 'Development OTP: Use 123456 or check terminal',
        },
        isMock: true,
      };
    }
  },

  /**
   * Verify OTP and retrieve session token
   */
  async verifyOtp(phone, otp) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }
      isLiveBackend = true;
      return { success: true, data };
    } catch (err) {
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('abort')) {
        throw err;
      }
      // Demo fallback only when backend is unreachable
      if (otp === '123456' || otp === '000000') {
        const mockUser = {
          id: 'user-demo-' + Date.now(),
          phone,
          name: 'Foodie Guest',
          email: '',
          role: 'customer',
          addresses: [],
        };
        return {
          success: true,
          data: {
            token: 'mock-jwt-token-' + Date.now(),
            user: mockUser,
          },
          isMock: true,
        };
      }
      throw new Error('Invalid OTP code. Please try again.');
    }
  },

  /**
   * Validate existing session token and retrieve user profile
   */
  async getMe() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/auth/me`);
      if (res.ok) {
        const data = await res.json();
        isLiveBackend = true;
        return { success: true, user: data.user || data.data };
      }
      if (res.status === 401) {
        // Expired or invalid token
        return { success: false, error: 'Session expired' };
      }
    } catch {
      // Backend unreachable, check if mock token exists
      if (token.startsWith('mock-jwt-token-')) {
        const savedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
        return { success: true, user: savedUser || DEFAULT_USER_PROFILE };
      }
    }

    return { success: false, error: 'Failed to authenticate session' };
  },

  /**
   * Logout from backend session
   */
  async logout() {
    try {
      await fetchWithTimeout(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
      });
    } catch {
      // Ignore network failures on logout
    }
  },

  /**
   * Fetch menu items from backend, falls back to mock menu
   */
  async fetchMenuItems() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/menu`);
      if (res.ok) {
        const data = await res.json();
        isLiveBackend = true;
        return { data: Array.isArray(data) ? data : data.menu || MOCK_MENU, isMock: false };
      }
    } catch {
      // Backend not running or unreachable, fallback
    }
    isLiveBackend = false;
    return { data: MOCK_MENU, isMock: true };
  },

  /**
   * Create a new order
   */
  async createOrder(orderPayload) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/orders`, {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        const data = await res.json();
        isLiveBackend = true;
        return { data: data.order || data.data, isMock: false };
      }
    } catch {
      // Backend unreachable, persist order to localStorage mock
    }

    isLiveBackend = false;
    const storedOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const newOrder = {
      id: `CRV-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'Order Received',
      total: orderPayload.total,
      items: orderPayload.items,
      deliveryAddress: orderPayload.deliveryAddress,
      deliveryPartner: {
        name: 'Jordan Brooks',
        rating: 4.9,
        phone: '+1 (555) 456-7890',
        vehicle: 'Honda Hornet - Orange',
      },
      timeline: [
        { status: 'Order Received', time: 'Just now', completed: true, current: true, desc: 'Kitchen acknowledged order' },
        { status: 'Preparing', time: 'In ~5 mins', completed: false, desc: 'Fresh ingredients being prepped' },
        { status: 'Out for Delivery', time: 'In ~20 mins', completed: false, desc: 'Rider picks up package' },
        { status: 'Delivered', time: 'In ~30 mins', completed: false, desc: 'Handed over at doorstep' },
      ],
    };

    const updated = [newOrder, ...storedOrders];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    return { data: newOrder, isMock: true };
  },

  /**
   * Fetch customer orders
   */
  async fetchOrders() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/orders`);
      if (res.ok) {
        const data = await res.json();
        isLiveBackend = true;
        return { data: Array.isArray(data) ? data : data.orders || [], isMock: false };
      }
    } catch {
      // Backend unreachable
    }

    isLiveBackend = false;
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || JSON.stringify(MOCK_ORDERS));
    return { data: stored, isMock: true };
  },

  /**
   * Fetch order details by ID
   */
  async fetchOrderById(orderId) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        isLiveBackend = true;
        return { data: data.order || data.data, isMock: false };
      }
    } catch {
      // Backend unreachable
    }

    isLiveBackend = false;
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || JSON.stringify(MOCK_ORDERS));
    const order = stored.find((o) => o.id === orderId || o.orderId === orderId) || stored[0];
    return { data: order, isMock: true };
  },

  /**
   * Fetch User Profile
   */
  async fetchUserProfile() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/users/me`);
      if (res.ok) {
        const data = await res.json();
        isLiveBackend = true;
        return { data: data.user || data.data, isMock: false };
      }
    } catch {
      // Backend unreachable
    }

    isLiveBackend = false;
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || JSON.stringify(DEFAULT_USER_PROFILE));
    return { data: profile, isMock: true };
  },

  /**
   * Update Profile
   */
  async updateUserProfile(updatedProfile) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        body: JSON.stringify(updatedProfile),
      });
      if (res.ok) {
        const data = await res.json();
        isLiveBackend = true;
        return { data: data.user || data.data, isMock: false };
      }
    } catch {
      // Backend unreachable
    }

    isLiveBackend = false;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));
    return { data: updatedProfile, isMock: true };
  },
};
