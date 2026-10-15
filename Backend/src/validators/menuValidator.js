import { body, query, param } from 'express-validator';

export const createMenuValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Food name is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('image')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
];

export const updateMenuValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Menu item ID is required'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('isAvailable').optional().isBoolean().withMessage('isAvailable must be boolean'),
];

export const menuQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be an integer >= 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  query('category').optional().trim(),
  query('search').optional().trim(),
];
