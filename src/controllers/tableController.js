import RestaurantTable from '../models/RestaurantTable.js';
import Reservation from '../models/Reservation.js';

export const getTables = async (req, res, next) => {
  try {
    const tables = await RestaurantTable.find({ isActive: true });
    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    next(error);
  }
};

export const createTable = async (req, res, next) => {
  try {
    const table = await RestaurantTable.create(req.body);
    res.status(201).json({ success: true, message: 'Table created successfully', data: table });
  } catch (error) {
    next(error);
  }
};

export const checkAvailability = async (req, res, next) => {
  try {
    const { startTime, endTime, partySize } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'startTime and endTime are required' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // البحث عن الطاولات المشغولة في هذا التوقيت
    const conflictingReservations = await Reservation.find({
      status: { $in: ['confirmed', 'seated'] },
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    }).select('table');

    const reservedTableIds = conflictingReservations.map((r) => r.table);

    const query = {
      _id: { $nin: reservedTableIds },
      status: { $ne: 'unavailable' },
      isActive: true,
    };

    if (partySize) {
      query.capacity = { $gte: parseInt(partySize) };
    }

    const availableTables = await RestaurantTable.find(query);
    res.status(200).json({ success: true, data: availableTables });
  } catch (error) {
    next(error);
  }
};