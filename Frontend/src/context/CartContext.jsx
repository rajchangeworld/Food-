import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';
import { DEFAULT_USER_PROFILE } from '../data/mockMenu';

export const CartContext = createContext(null);

const CART_STORAGE_KEY = 'cravebite_cart';
const PROMO_STORAGE_KEY = 'cravebite_promo';
const ADDR_STORAGE_KEY = 'cravebite_selected_address';

export const VALID_PROMOS = {
  TASTY50: { code: 'TASTY50', discountPercent: 50, maxDiscount: 10, minOrder: 15, label: '50% OFF (Up to $10)' },
  FREESHIP: { code: 'FREESHIP', freeDelivery: true, minOrder: 10, label: 'Free Delivery' },
  SAVE5: { code: 'SAVE5', flatDiscount: 5.0, minOrder: 25, label: '$5.00 OFF on orders above $25' }
};

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState(() => {
    try {
      return localStorage.getItem(PROMO_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [selectedAddress, setSelectedAddress] = useState(() => {
    try {
      const saved = localStorage.getItem(ADDR_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE.addresses[0];
    } catch {
      return DEFAULT_USER_PROFILE.addresses[0];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (promoCode) {
        localStorage.setItem(PROMO_STORAGE_KEY, promoCode);
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save promo', e);
    }
  }, [promoCode]);

  useEffect(() => {
    try {
      if (selectedAddress) {
        localStorage.setItem(ADDR_STORAGE_KEY, JSON.stringify(selectedAddress));
      }
    } catch (e) {
      console.error('Failed to save address', e);
    }
  }, [selectedAddress]);

  // Calculations
  const { subtotal, totalCount, deliveryFee, restaurantFee, discount, grandTotal, activePromo } = useMemo(() => {
    const rawSubtotal = items.reduce((acc, item) => {
      const itemBase = Number(item.price) || 0;
      const optionsTotal = (item.selectedOptions || []).reduce((optSum, o) => optSum + (Number(o.price) || 0), 0);
      return acc + (itemBase + optionsTotal) * item.quantity;
    }, 0);

    const count = items.reduce((acc, item) => acc + item.quantity, 0);

    // Free delivery if order >= $35 or cart is empty
    let standardDelivery = count === 0 ? 0 : rawSubtotal >= 35 ? 0 : 2.99;
    const packagingFee = count === 0 ? 0 : 1.49;

    let discountAmount = 0;
    let promoDetails = null;

    if (promoCode && VALID_PROMOS[promoCode.toUpperCase()]) {
      const promo = VALID_PROMOS[promoCode.toUpperCase()];
      if (rawSubtotal >= promo.minOrder) {
        promoDetails = promo;
        if (promo.freeDelivery) {
          standardDelivery = 0;
          discountAmount += 2.99;
        } else if (promo.discountPercent) {
          discountAmount = Math.min((rawSubtotal * promo.discountPercent) / 100, promo.maxDiscount);
        } else if (promo.flatDiscount) {
          discountAmount = promo.flatDiscount;
        }
      }
    }

    const calculatedTotal = Math.max(0, rawSubtotal + standardDelivery + packagingFee - discountAmount);

    return {
      subtotal: Number(rawSubtotal.toFixed(2)),
      totalCount: count,
      deliveryFee: Number(standardDelivery.toFixed(2)),
      restaurantFee: Number(packagingFee.toFixed(2)),
      discount: Number(discountAmount.toFixed(2)),
      grandTotal: Number(calculatedTotal.toFixed(2)),
      activePromo: promoDetails
    };
  }, [items, promoCode]);

  const addToCart = (item, quantity = 1, selectedOptions = []) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (i) => i.id === item.id && JSON.stringify(i.selectedOptions || []) === JSON.stringify(selectedOptions)
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }

      return [
        ...prevItems,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          quantity,
          selectedOptions
        }
      ];
    });

    showToast(`Added ${item.name} to cart!`, 'success');
  };

  const removeFromCart = (itemId, selectedOptions = null) => {
    const itemToRemove = items.find((i) => i.id === itemId);
    setItems((prevItems) =>
      prevItems.filter((i) => {
        if (selectedOptions) {
          return !(i.id === itemId && JSON.stringify(i.selectedOptions) === JSON.stringify(selectedOptions));
        }
        return i.id !== itemId;
      })
    );
    if (itemToRemove) {
      showToast(`Removed ${itemToRemove.name} from cart`, 'info');
    }
  };

  const updateQuantity = (itemId, newQuantity, selectedOptions = null) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, selectedOptions);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        const matches = selectedOptions
          ? item.id === itemId && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
          : item.id === itemId;
        if (matches) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
  };

  const applyPromo = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      showToast('Please enter a coupon code', 'error');
      return false;
    }

    const promo = VALID_PROMOS[cleanCode];
    if (!promo) {
      showToast(`Invalid coupon code "${cleanCode}". Try TASTY50 or FREESHIP`, 'error');
      return false;
    }

    if (subtotal < promo.minOrder) {
      showToast(`Minimum order amount of $${promo.minOrder} required for ${cleanCode}`, 'error');
      return false;
    }

    setPromoCode(cleanCode);
    showToast(`Coupon ${cleanCode} applied successfully!`, 'success');
    return true;
  };

  const removePromo = () => {
    setPromoCode('');
    showToast('Coupon removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        totalCount,
        deliveryFee,
        restaurantFee,
        discount,
        grandTotal,
        promoCode,
        activePromo,
        selectedAddress,
        setSelectedAddress,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromo,
        removePromo
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
