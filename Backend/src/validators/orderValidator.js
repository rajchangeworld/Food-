import { body, param } from 'express-validator';
import { ORDER_STATUSES } from '../models/Order.js';

export const createOrderValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain an array with at least one item'),
  body('items.*.id')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Item ID is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Each item quantity must be at least 1'),
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required'),
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Customer phone number is required'),
  body('deliveryAddress')
    .isObject()
    .withMessage('Delivery address details are required'),
  body('deliveryAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('deliveryAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
];

export const updateOrderStatusValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Order identifier is required'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('New status is required')
    .isIn(ORDER_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`),
  body('note')
    .optional()
    .trim(),
];
