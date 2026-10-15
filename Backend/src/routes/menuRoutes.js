import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';
import {
  createMenuValidator,
  updateMenuValidator,
  menuQueryValidator,
} from '../validators/menuValidator.js';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', menuQueryValidator, validate, getMenuItems);
router.get('/:id', getMenuItemById);

// Admin-only mutation routes
router.post('/', authenticate, requireAdmin, createMenuValidator, validate, createMenuItem);
router.patch('/:id', authenticate, requireAdmin, updateMenuValidator, validate, updateMenuItem);
router.put('/:id', authenticate, requireAdmin, updateMenuValidator, validate, updateMenuItem);
router.delete('/:id', authenticate, requireAdmin, deleteMenuItem);

export default router;
