import mongoose from 'mongoose';

export const ORDER_STATUSES = [
  'Order Received',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const orderItemSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: false,
    },
    menuItemId: {
      type: String, // allows custom IDs like 'b1' or stringified ObjectId
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    image: {
      type: String,
      default: '',
    },
    selectedOptions: [
      {
        name: String,
        price: Number,
      },
    ],
    itemTotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ORDER_STATUSES,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Order must contain at least one item',
      },
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    deliveryAddress: {
      tag: { type: String, default: 'Home' },
      street: { type: String, required: true },
      landmark: { type: String, default: '' },
      city: { type: String, required: true },
      pincode: { type: String, default: '' },
      contactPhone: { type: String, default: '' },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    packagingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'Order Received',
      index: true,
    },
    statusHistory: [statusHistorySchema],
    deliveryPartner: {
      name: { type: String, default: 'Jordan Brooks' },
      rating: { type: Number, default: 4.9 },
      phone: { type: String, default: '+1 (555) 456-7890' },
      vehicle: { type: String, default: 'Honda Hornet - Orange' },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // Expose frontend-compatible 'id' & 'total' fields
        ret.id = ret.orderId;
        ret.total = ret.grandTotal;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.orderId;
        ret.total = ret.grandTotal;
        return ret;
      },
    },
  }
);

export const Order = mongoose.model('Order', orderSchema);
export default Order;
