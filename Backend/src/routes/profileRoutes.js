import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { updateProfileValidator } from '../validators/userValidator.js';
import { validate } from '../middleware/validate.js';
import { optionalAuthenticate } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

router.use(optionalAuthenticate);

// Default guest profile when unauthenticated
const DEFAULT_GUEST_PROFILE = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 382-9012',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  isDemo: true,
  addresses: [
    {
      id: 'addr-1',
      tag: 'Home',
      street: '42 Marine Drive, Apt 4B',
      landmark: 'Near Bayview Promenade',
      city: 'Downtown Metro',
      pincode: '400020',
      isDefault: true,
    },
    {
      id: 'addr-2',
      tag: 'Office',
      street: 'Cyber Tower 3, 5th Floor, Suite 502',
      landmark: 'Tech Park Main Entrance',
      city: 'Innovation Hub',
      pincode: '400078',
      isDefault: false,
    },
  ],
  preferences: {
    pushNotifications: true,
    smsAlerts: true,
    specialOffers: true,
  },
};

router.get('/', async (req, res, next) => {
  if (req.user) {
    return getUserProfile(req, res, next);
  }
  return res.status(200).json(DEFAULT_GUEST_PROFILE);
});

router.put('/', updateProfileValidator, validate, async (req, res, next) => {
  if (req.user) {
    return updateUserProfile(req, res, next);
  }
  return res.status(200).json({ ...DEFAULT_GUEST_PROFILE, ...req.body });
});

router.patch('/', updateProfileValidator, validate, async (req, res, next) => {
  if (req.user) {
    return updateUserProfile(req, res, next);
  }
  return res.status(200).json({ ...DEFAULT_GUEST_PROFILE, ...req.body });
});

export default router;
