import mongoose from 'mongoose';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Recipe from '../models/Recipe.js';
import InventoryItem from '../models/InventoryItem.js';
import InventoryTransaction from '../models/InventoryTransaction.js';

// @desc    Create new order (Server calculates prices & validates inventory)
// @route   POST /api/orders
// @access  Private (Admin / Staff)
export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, orderType, table } = req.body;

    let totalAmount = 0;
    const orderItemsSnapshots = [];

    // التحقق من الأصناف وحساب التكلفة من قاعدة البيانات مباشرة
    for (const cartItem of items) {
      const menuItem = await MenuItem.findOne({ _id: cartItem.menuItem, isActive: true, isAvailable: true }).session(session);
      if (!menuItem) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: `Menu item ${cartItem.menuItem} is not available` });
      }

      const lineTotal = menuItem.price * cartItem.quantity;
      totalAmount += lineTotal;

      orderItemsSnapshots.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        unitPrice: menuItem.price,
        quantity: cartItem.quantity,
        lineTotal,
      });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await Order.create(
      [
        {
          orderNumber,
          items: orderItemsSnapshots,
          orderType,
          table: orderType === 'dine_in' ? table : undefined,
          totalAmount,
          createdBy: req.user._id,
          status: 'pending',
          inventoryDeducted: false,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, message: 'Order created successfully', data: order[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Update order status & handle inventory deduction / restoration securely
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin / Staff / Kitchen)
export const updateOrderStatus = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // سياسة خصم المخزون: عند الانتقال إلى حالة 'preparing' أو 'confirmed' (أول مرحلة تجهيز)
    const shouldDeduct = (status === 'confirmed' || status === 'preparing') && !order.inventoryDeducted;
    const shouldRestore = status === 'cancelled' && order.inventoryDeducted;

    if (shouldDeduct) {
      for (const item of order.items) {
        const recipe = await Recipe.findOne({ menuItem: item.menuItem }).session(session);
        if (recipe) {
          for (const ing of recipe.ingredients) {
            const requiredQty = ing.quantityRequired * item.quantity;
            const invItem = await InventoryItem.findById(ing.inventoryItem).session(session);

            if (!invItem || invItem.quantity < requiredQty) {
              await session.abortTransaction();
              session.endSession();
              return res.status(400).json({
                success: false,
                message: `Insufficient inventory for item: ${invItem ? invItem.name : 'Unknown'}`,
              });
            }

            const prevQty = invItem.quantity;
            invItem.quantity -= requiredQty;
            await invItem.save({ session });

            await InventoryTransaction.create(
              [
                {
                  inventoryItem: invItem._id,
                  transactionType: 'order_consumption',
                  quantityChange: -requiredQty,
                  previousQuantity: prevQty,
                  resultingQuantity: invItem.quantity,
                  relatedOrder: order._id,
                  performedBy: req.user._id,
                  reason: `Consumption for order ${order.orderNumber}`,
                },
              ],
              { session }
            );
          }
        }
      }
      order.inventoryDeducted = true;
    }

    // سياسة إعادة المخزون في حال الإلغاء إذا تم خصمه مسبقاً
    if (shouldRestore) {
      for (const item of order.items) {
        const recipe = await Recipe.findOne({ menuItem: item.menuItem }).session(session);
        if (recipe) {
          for (const ing of recipe.ingredients) {
            const restoreQty = ing.quantityRequired * item.quantity;
            const invItem = await InventoryItem.findById(ing.inventoryItem).session(session);

            if (invItem) {
              const prevQty = invItem.quantity;
              invItem.quantity += restoreQty;
              await invItem.save({ session });

              await InventoryTransaction.create(
                [
                  {
                    inventoryItem: invItem._id,
                    transactionType: 'reversal',
                    quantityChange: restoreQty,
                    previousQuantity: prevQty,
                    resultingQuantity: invItem.quantity,
                    relatedOrder: order._id,
                    performedBy: req.user._id,
                    reason: `Stock restored due to cancellation of order ${order.orderNumber}`,
                  },
                ],
                { session }
              );
            }
          }
        }
      }
      order.inventoryDeducted = false;
    }

    order.status = status;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, message: 'Order status updated successfully', data: order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin / Staff / Kitchen)
export const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.orderType) query.orderType = req.query.orderType;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('createdBy', 'name email')
      .populate('table')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ success: true, data: orders, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};