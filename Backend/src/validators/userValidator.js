import { body, param } from 'express-validator';

export const updateProfileValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().trim().isEmail().withMessage('Please provide a valid email address'),
  body('avatar').optional().trim().isURL().withMessage('Avatar must be a valid URL'),
  body('preferences').optional().isObject().withMessage('Preferences must be an object'),
];

export const createAddressValidator = [
  body('tag').optional().trim(),
  body('street').trim().notEmpty().withMessage('Street address is required'),
  body('landmark').optional().trim(),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('contactPhone').optional().trim(),
  body('isDefault').optional().isBoolean(),
];

export const updateAddressValidator = [
  param('addressId').trim().notEmpty().withMessage('Address identifier is required'),
  body('street').optional().trim().notEmpty().withMessage('Street address cannot be empty'),
  body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
  body('pincode').optional().trim().notEmpty().withMessage('Pincode cannot be empty'),
];
