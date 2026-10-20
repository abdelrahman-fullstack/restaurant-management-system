import InventoryItem from '../models/InventoryItem.js';
import InventoryTransaction from '../models/InventoryTransaction.js';

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private (Admin / Staff)
export const getInventoryItems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    const total = await InventoryItem.countDocuments(query);
    const items = await InventoryItem.find(query)
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

// @desc    Get low stock items
// @route   GET /api/inventory/low-stock
// @access  Private (Admin / Staff)
export const getLowStockItems = async (req, res, next) => {
  try {
    const items = await InventoryItem.find({
      isActive: true,
      $expr: { $lte: ['$quantity', '$minimumStockLevel'] },
    });

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Create inventory item
// @route   POST /api/inventory
// @access  Private (Admin / Staff)
export const createInventoryItem = async (req, res, next) => {
  try {
    const item = await InventoryItem.create(req.body);

    // تسجيل حركة الـ Creation
    await InventoryTransaction.create({
      inventoryItem: item._id,
      transactionType: 'purchase',
      quantityChange: item.quantity,
      previousQuantity: 0,
      resultingQuantity: item.quantity,
      performedBy: req.user._id,
      reason: 'Initial stock entry',
    });

    res.status(201).json({ success: true, message: 'Inventory item created successfully', data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Adjust inventory stock
// @route   POST /api/inventory/:id/adjust
// @access  Private (Admin / Staff)
export const adjustStock = async (req, res, next) => {
  try {
    const { quantityChange, reason } = req.body;
    const item = await InventoryItem.findById(req.params.id);

    if (!item || !item.isActive) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    const resultingQuantity = item.quantity + quantityChange;

    if (resultingQuantity < 0) {
      return res.status(400).json({ success: false, message: 'Adjustment would result in negative stock' });
    }

    const previousQuantity = item.quantity;
    item.quantity = resultingQuantity;
    await item.save();

    await InventoryTransaction.create({
      inventoryItem: item._id,
      transactionType: 'adjustment',
      quantityChange,
      previousQuantity,
      resultingQuantity,
      performedBy: req.user._id,
      reason,
    });

    res.status(200).json({ success: true, message: 'Stock adjusted successfully', data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transactions for an inventory item
// @route   GET /api/inventory/:id/transactions
// @access  Private (Admin / Staff)
export const getItemTransactions = async (req, res, next) => {
  try {
    const transactions = await InventoryTransaction.find({ inventoryItem: req.params.id })
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};