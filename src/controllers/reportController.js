import Order from '../models/Order.js';

export const getSalesSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const dateQuery = { status: 'completed' };
    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
      if (endDate) dateQuery.createdAt.$lte = new Date(endDate);
    }

    const summary = await Order.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: summary[0] || { totalSales: 0, totalOrders: 0, avgOrderValue: 0 },
    });
  } catch (error) {
    next(error);
  }
};

export const getTopSellingItems = async (req, res, next) => {
  try {
    const topItems = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          itemName: { $first: '$items.name' },
          totalQuantitySold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.lineTotal' },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({ success: true, data: topItems });
  } catch (error) {
    next(error);
  }
};