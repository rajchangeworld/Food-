import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema(
  {
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
  },
  { _id: false }
);

const menuSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Food item name is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    prepTime: {
      type: String,
      default: '20-25 min',
    },
    calories: {
      type: String,
      default: '',
    },
    isVeg: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
      index: true,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    options: [optionSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // Expose frontend-friendly 'id' mapped to itemId or _id
        ret.id = ret.itemId || ret._id.toString();
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.itemId || ret._id.toString();
        return ret;
      },
    },
  }
);

// Text index for search functionality
menuSchema.index({ name: 'text', description: 'text', category: 'text' });

export const Menu = mongoose.model('Menu', menuSchema);
export default Menu;
