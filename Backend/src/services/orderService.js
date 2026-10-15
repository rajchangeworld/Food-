import mongoose from 'mongoose';
import { Order, ORDER_STATUSES } from '../models/Order.js';
import { Menu } from '../models/Menu.js';
import { ApiError } from '../utils/apiError.js';
import { generateOrderId } from '../utils/orderIdGenerator.js';
import { emitOrderStatusUpdate } from '../sockets/socketManager.js';
import { config } from '../config/env.js';

// Allowed state transitions
const ALLOWED_TRANSITIONS = {
  'Order Received': ['Preparing', 'Cancelled'],
  'Preparing': ['Out for Delivery', 'Cancelled'],
  'Out for Delivery': ['Delivered'],
  'Delivered': [],
  'Cancelled': [],
};

/**
 * Validate order status transition
 */
export function isValidStatusTransition(currentStatus, nextStatus) {
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  return Array.isArray(allowed) && allowed.includes(nextStatus);
}

/**
 * Calculate totals and validate cart items against live Menu collection
 */
export async function calculateAndValidateOrderItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw ApiError.badRequest('Cart is empty. Please add at least one item to your order.');
  }

  const validatedItems = [];
  let subtotal = 0;

  for (const item of rawItems) {
    const rawId = item.id || item.foodId || item._id;
    if (!rawId) {
      throw ApiError.badRequest('Item identifier is missing');
    }

    const quantity = parseInt(item.quantity, 10);
    if (!quantity || quantity < 1) {
      throw ApiError.badRequest(`Invalid quantity for item ${item.name || rawId}`);
    }

    // Lookup menu item by custom itemId ('b1', 'p1') or Mongoose ObjectId
    let menuItem = null;
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      menuItem = await Menu.findById(rawId);
    }
    if (!menuItem) {
      menuItem = await Menu.findOne({ itemId: rawId });
    }

    if (!menuItem) {
      throw ApiError.badRequest(`Menu item "${item.name || rawId}" does not exist in our catalog`);
    }

    if (!menuItem.isAvailable) {
      throw ApiError.badRequest(`"${menuItem.name}" is currently sold out and unavailable`);
    }

    // Calculate item price with any selected options
    let itemPrice = menuItem.price;
    const validatedOptions = [];

    if (Array.isArray(item.selectedOptions) && item.selectedOptions.length > 0) {
      for (const opt of item.selectedOptions) {
        // Verify option exists in menu item options
        const foundOption = menuItem.options.find(
          (o) => o.name.toLowerCase() === (opt.name || '').toLowerCase()
        );
        if (foundOption) {
          itemPrice += foundOption.price;
          validatedOptions.push({
            name: foundOption.name,
            price: foundOption.price,
          });
        }
      }
    }

    // Round to 2 decimals
    itemPrice = Math.round(itemPrice * 100) / 100;
    const itemTotal = Math.round(itemPrice * quantity * 100) / 100;
    subtotal += itemTotal;

    validatedItems.push({
      food: menuItem._id,
      menuItemId: menuItem.itemId || menuItem._id.toString(),
      name: menuItem.name,
      price: itemPrice,
      quantity,
      image: menuItem.image,
      selectedOptions: validatedOptions,
      itemTotal,
    });
  }

  subtotal = Math.round(subtotal * 100) / 100;

  // Delivery fee calculation ($2.99 or free over $35)
  const deliveryFee = subtotal >= 35 ? 0 : 2.99;
  const packagingFee = 1.5;
  const discount = 0; // Can be enhanced with promo codes

  const grandTotal = Math.round((subtotal + deliveryFee + packagingFee - discount) * 100) / 100;

  return {
    items: validatedItems,
    subtotal,
    deliveryFee,
    packagingFee,
    discount,
    grandTotal,
  };
}

/**
 * Start optional simulated progression of order status (Dev only)
 */
export function startOrderStatusSimulation(orderId) {
  if (!config.simulation.enabled || config.env === 'production') return;

  const steps = [
    { status: 'Preparing', delay: config.simulation.intervalMs, note: 'Chef began preparing ingredients (Simulation)' },
    { status: 'Out for Delivery', delay: config.simulation.intervalMs * 2, note: 'Rider picked up the order (Simulation)' },
    { status: 'Delivered', delay: config.simulation.intervalMs * 3, note: 'Order handed over at doorstep (Simulation)' },
  ];

  for (const step of steps) {
    setTimeout(async () => {
      try {
        const order = await Order.findOne({ orderId });
        if (!order || order.status === 'Cancelled' || order.status === 'Delivered') {
          return;
        }

        if (isValidStatusTransition(order.status, step.status)) {
          order.status = step.status;
          order.statusHistory.push({
            status: step.status,
            timestamp: new Date(),
            note: step.note,
          });
          await order.save();

          emitOrderStatusUpdate(orderId, {
            status: step.status,
            note: step.note,
            isSimulation: true,
            statusHistory: order.statusHistory,
          });
          console.log(`[Order Simulation] ${orderId} transitioned to ${step.status}`);
        }
      } catch (err) {
        console.error(`[Order Simulation Error] ${err.message}`);
      }
    }, step.delay);
  }
}
