import MenuItem from '../models/MenuItem.js';

// @desc    Get all menu items (with search, filter, pagination)
// @route   GET /api/menu
// @access  Public
export const getMenuItems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.isAvailable !== undefined) {
      query.isAvailable = req.query.isAvailable === 'true';
    }

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    const total = await MenuItem.countDocuments(query);
    const items = await MenuItem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single menu item by ID
// @route   GET /api/menu/:id
// @access  Public
export const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findOne({ _id: req.params.id, isActive: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private (Admin / Staff)
export const createMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, message: 'Menu item created successfully', data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update menu item
// @route   PATCH /api/menu/:id
// @access  Private (Admin / Staff)
export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.status(200).json({ success: true, message: 'Menu item updated successfully', data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu item (Soft Delete)
// @route   DELETE /api/menu/:id
// @access  Private (Admin)
export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.status(200).json({ success: true, message: 'Menu item deactivated successfully' });
  } catch (error) {
    next(error);
  }
};