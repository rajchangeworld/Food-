import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import {
  createOrderValidator,
  updateOrderStatusValidator,
} from '../validators/orderValidator.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All order endpoints require authentication as per requirements
router.use(authenticate);

router.post('/', createOrderValidator, validate, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatusValidator, validate, updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;
