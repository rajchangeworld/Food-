import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/userController.js';
import {
  updateProfileValidator,
  createAddressValidator,
  updateAddressValidator,
} from '../validators/userValidator.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/me', getUserProfile);
router.patch('/me', updateProfileValidator, validate, updateUserProfile);
router.put('/me', updateProfileValidator, validate, updateUserProfile); // PUT alias

// Addresses sub-routes
router.get('/me/addresses', getAddresses);
router.post('/me/addresses', createAddressValidator, validate, addAddress);
router.patch('/me/addresses/:addressId', updateAddressValidator, validate, updateAddress);
router.delete('/me/addresses/:addressId', deleteAddress);

export default router;
