import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      default: 'Home',
      trim: true,
    },
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true, timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: 'Foodie Guest',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    avatar: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
      index: true,
    },
    addresses: [addressSchema],
    preferences: {
      pushNotifications: { type: Boolean, default: true },
      smsAlerts: { type: Boolean, default: true },
      specialOffers: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
export default User;
