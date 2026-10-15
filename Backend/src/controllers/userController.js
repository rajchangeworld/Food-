import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';

export async function getUserProfile(req, res, next) {
  try {
    const user = req.user;
    const profile = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      addresses: user.addresses,
      preferences: user.preferences,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      data: profile,
      profile, // Compatibility with frontend
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserProfile(req, res, next) {
  try {
    const user = req.user;
    const { name, email, avatar, preferences, addresses } = req.body;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (avatar !== undefined) user.avatar = avatar;
    if (preferences !== undefined) {
      user.preferences = { ...user.preferences, ...preferences };
    }
    if (addresses !== undefined && Array.isArray(addresses)) {
      user.addresses = addresses;
    }

    await user.save();

    const profile = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      addresses: user.addresses,
      preferences: user.preferences,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
      profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAddresses(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      addresses: req.user.addresses || [],
    });
  } catch (error) {
    next(error);
  }
}

export async function addAddress(req, res, next) {
  try {
    const user = req.user;
    const { tag, street, landmark, city, pincode, contactPhone, isDefault } = req.body;

    // If isDefault is true, set existing addresses isDefault to false
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      tag: tag || 'Home',
      street,
      landmark: landmark || '',
      city,
      pincode,
      contactPhone: contactPhone || user.phone,
      isDefault: isDefault || user.addresses.length === 0,
    });

    await user.save();
    const newAddress = user.addresses[user.addresses.length - 1];

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      address: newAddress,
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAddress(req, res, next) {
  try {
    const user = req.user;
    const { addressId } = req.params;
    const address = user.addresses.id(addressId);

    if (!address) {
      return next(ApiError.notFound(`Address with ID "${addressId}" was not found`));
    }

    const { tag, street, landmark, city, pincode, contactPhone, isDefault } = req.body;

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    } else if (isDefault === false) {
      address.isDefault = false;
    }

    if (tag !== undefined) address.tag = tag;
    if (street !== undefined) address.street = street;
    if (landmark !== undefined) address.landmark = landmark;
    if (city !== undefined) address.city = city;
    if (pincode !== undefined) address.pincode = pincode;
    if (contactPhone !== undefined) address.contactPhone = contactPhone;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address,
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAddress(req, res, next) {
  try {
    const user = req.user;
    const { addressId } = req.params;
    const address = user.addresses.id(addressId);

    if (!address) {
      return next(ApiError.notFound(`Address with ID "${addressId}" was not found`));
    }

    user.addresses.pull({ _id: addressId });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
}
