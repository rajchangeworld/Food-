import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { ApiError } from '../utils/apiError.js';
import { generateOrderId } from '../utils/orderIdGenerator.js';
import {
  calculateAndValidateOrderItems,
  isValidStatusTransition,
  startOrderStatusSimulation,
} from '../services/orderService.js';
import { emitOrderStatusUpdate } from '../sockets/socketManager.js';

/**
 * Format order document for frontend compatibility (including timeline)
 */
function formatOrderResponse(order) {
  const json = order.toJSON ? order.toJSON() : { ...order };
  const currentStatus = json.status;

  const timeline = [
    {
      status: 'Order Received',
      time: new Date(json.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      desc: 'Restaurant acknowledged order',
      completed: true,
      current: currentStatus === 'Order Received',
    },
    {
      status: 'Preparing',
      time: currentStatus === 'Order Received' ? 'In ~5 mins' : 'Completed',
      desc: 'Chef is preparing fresh ingredients',
      completed: ['Preparing', 'Out for Delivery', 'Delivered'].includes(currentStatus),
      current: currentStatus === 'Preparing',
    },
    {
      status: 'Out for Delivery',
      time: ['Order Received', 'Preparing'].includes(currentStatus) ? 'In ~20 mins' : 'Completed',
      desc: 'Rider picked up the order',
      completed: ['Out for Delivery', 'Delivered'].includes(currentStatus),
      current: currentStatus === 'Out for Delivery',
    },
    {
      status: 'Delivered',
      time: currentStatus === 'Delivered' ? 'Delivered' : 'In ~35 mins',
      desc: 'Package handed over at doorstep',
      completed: currentStatus === 'Delivered',
      current: currentStatus === 'Delivered',
    },
  ];

  if (currentStatus === 'Cancelled') {
    timeline.push({
      status: 'Cancelled',
      time: 'Cancelled',
      desc: 'Order was cancelled',
      completed: true,
      current: true,
    });
  }

  return {
    ...json,
    id: json.orderId,
    total: json.grandTotal,
    timeline,
  };
}

/**
 * Helper to find order by orderId or ObjectId
 */
async function findOrderByIdOrCode(id) {
  let order = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    order = await Order.findById(id);
  }
  if (!order) {
    order = await Order.findOne({ orderId: id });
  }
  return order;
}

export async function createOrder(req, res, next) {
  try {
    const { items, customerName, phoneNumber, deliveryAddress, deliveryPartner } = req.body;

    // Validate and calculate totals server-side (never trust client total)
    const calculation = await calculateAndValidateOrderItems(items);

    const orderId = generateOrderId('CRV');

    const newOrder = await Order.create({
      orderId,
      user: req.user._id,
      items: calculation.items,
      customerName: customerName || req.user.name,
      phoneNumber: phoneNumber || req.user.phone,
      deliveryAddress,
      subtotal: calculation.subtotal,
      deliveryFee: calculation.deliveryFee,
      packagingFee: calculation.packagingFee,
      discount: calculation.discount,
      grandTotal: calculation.grandTotal,
      status: 'Order Received',
      statusHistory: [
        {
          status: 'Order Received',
          timestamp: new Date(),
          note: 'Order successfully created and accepted',
        },
      ],
      deliveryPartner: deliveryPartner || {
        name: 'Jordan Brooks',
        rating: 4.9,
        phone: '+1 (555) 456-7890',
        vehicle: 'Honda Hornet - Orange',
      },
    });

    // Start simulation if enabled in dev environment
    startOrderStatusSimulation(newOrder.orderId);

    const formatted = formatOrderResponse(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: formatted,
      order: formatted,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrders(req, res, next) {
  try {
    // If user is admin and query specifies all, return all; otherwise return user's orders
    const query = req.user.role === 'admin' && req.query.all === 'true'
      ? {}
      : { user: req.user._id };

    const orders = await Order.find(query).sort({ createdAt: -1 });
    const formattedOrders = orders.map(formatOrderResponse);

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders,
      data: formattedOrders, // Frontend compatibility alias
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const order = await findOrderByIdOrCode(id);

    if (!order) {
      return next(ApiError.notFound(`Order with ID "${id}" was not found`));
    }

    // Authorization check: only owner or admin can view
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return next(ApiError.forbidden('You are not authorized to view this order'));
    }

    const formatted = formatOrderResponse(order);

    res.status(200).json({
      success: true,
      data: formatted,
      order: formatted,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status: nextStatus, note } = req.body;

    const order = await findOrderByIdOrCode(id);
    if (!order) {
      return next(ApiError.notFound(`Order with ID "${id}" was not found`));
    }

    // Permission check: Customers can only cancel their own orders (if state allows)
    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && !isOwner) {
      return next(ApiError.forbidden('Not authorized to modify this order'));
    }

    if (!isAdmin && nextStatus !== 'Cancelled') {
      return next(ApiError.forbidden('Customers can only request order cancellation'));
    }

    // Validate transition
    if (!isValidStatusTransition(order.status, nextStatus)) {
      return next(
        ApiError.badRequest(
          `Invalid status transition from "${order.status}" to "${nextStatus}"`
        )
      );
    }

    // Update status and history
    order.status = nextStatus;
    order.statusHistory.push({
      status: nextStatus,
      timestamp: new Date(),
      note: note || `Status updated to ${nextStatus}`,
    });

    await order.save();

    const formatted = formatOrderResponse(order);

    // Emit real-time status update via Socket.IO
    emitOrderStatusUpdate(order.orderId, {
      status: nextStatus,
      note: note || '',
      statusHistory: order.statusHistory,
      timeline: formatted.timeline,
    });

    res.status(200).json({
      success: true,
      message: `Order status successfully updated to "${nextStatus}"`,
      data: formatted,
      order: formatted,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = await findOrderByIdOrCode(id);

    if (!order) {
      return next(ApiError.notFound(`Order with ID "${id}" was not found`));
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && !isOwner) {
      return next(ApiError.forbidden('Not authorized to delete this order'));
    }

    // Deletion is only allowed if order is Cancelled or Order Received
    if (!['Cancelled', 'Order Received'].includes(order.status)) {
      return next(
        ApiError.badRequest(
          `Cannot delete an order with status "${order.status}". Only Cancelled or un-prepped orders may be removed.`
        )
      );
    }

    await Order.deleteOne({ _id: order._id });

    res.status(200).json({
      success: true,
      message: `Order ${order.orderId} deleted successfully`,
      orderId: order.orderId,
    });
  } catch (error) {
    next(error);
  }
}
