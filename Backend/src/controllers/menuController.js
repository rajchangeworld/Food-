import mongoose from 'mongoose';
import { Menu } from '../models/Menu.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Helper to find a menu item by either custom itemId ('b1', 'p1') or ObjectId
 */
async function findMenuItemByIdOrCustom(id) {
  let item = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    item = await Menu.findById(id);
  }
  if (!item) {
    item = await Menu.findOne({ itemId: id });
  }
  return item;
}

export async function getMenuItems(req, res, next) {
  try {
    const { category, search, isFeatured, isPopular, page, limit } = req.query;

    const query = { isAvailable: true };

    // Category filter (case-insensitive, ignore 'all')
    if (category && category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Search filter
    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } },
      ];
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    if (isPopular !== undefined) {
      query.isPopular = isPopular === 'true';
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Menu.countDocuments(query);
    const items = await Menu.find(query)
      .sort({ isFeatured: -1, rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: items.length,
      totalCount,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      menu: items,
      data: items, // Frontend compatibility alias
    });
  } catch (error) {
    next(error);
  }
}

export async function getMenuItemById(req, res, next) {
  try {
    const { id } = req.params;
    const item = await findMenuItemByIdOrCustom(id);

    if (!item) {
      return next(ApiError.notFound(`Menu item with ID "${id}" was not found`));
    }

    res.status(200).json({
      success: true,
      data: item,
      menuItem: item,
    });
  } catch (error) {
    next(error);
  }
}

export async function createMenuItem(req, res, next) {
  try {
    const newItem = await Menu.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMenuItem(req, res, next) {
  try {
    const { id } = req.params;
    const item = await findMenuItemByIdOrCustom(id);

    if (!item) {
      return next(ApiError.notFound(`Menu item with ID "${id}" was not found`));
    }

    Object.assign(item, req.body);
    await item.save();

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMenuItem(req, res, next) {
  try {
    const { id } = req.params;
    const item = await findMenuItemByIdOrCustom(id);

    if (!item) {
      return next(ApiError.notFound(`Menu item with ID "${id}" was not found`));
    }

    await Menu.deleteOne({ _id: item._id });

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
      id,
    });
  } catch (error) {
    next(error);
  }
}
