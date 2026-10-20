import Reservation from '../models/Reservation.js';
import RestaurantTable from '../models/RestaurantTable.js';

export const createReservation = async (req, res, next) => {
  try {
    const { customerName, customerPhone, customerEmail, table, partySize, startTime, endTime, notes } = req.body;

    const tableDoc = await RestaurantTable.findById(table);
    if (!tableDoc || !tableDoc.isActive) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    if (tableDoc.capacity < partySize) {
      return res.status(400).json({ success: false, message: `Table capacity (${tableDoc.capacity}) is too small for party size (${partySize})` });
    }

    const start = new Date(startTime);
    // افتراض وقت الحجز سنتين/ساعتين لو لم يحدد وقت الانتهاء
    const end = endTime ? new Date(endTime) : new Date(start.getTime() + 2 * 60 * 60 * 1000);

    if (end <= start) {
      return res.status(400).json({ success: false, message: 'endTime must be after startTime' });
    }

    // منع تداخل الحجوزات لنفس الطاولة
    const conflict = await Reservation.findOne({
      table,
      status: { $in: ['confirmed', 'seated'] },$or: [{ startTime: { $lt: end }, endTime: {$gt: start } }],
    });

    if (conflict) {
      return res.status(409).json({ success: false, message: 'Table is already reserved during this time period' });
    }

    const reservation = await Reservation.create({
      customerName,
      customerPhone,
      customerEmail,
      table,
      partySize,
      startTime: start,
      endTime: end,
      notes,
      createdBy: req.user ? req.user._id : undefined,
    });

    res.status(201).json({ success: true, message: 'Reservation created successfully', data: reservation });
  } catch (error) {
    next(error);
  }
};

export const getReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find()
      .populate('table')
      .sort({ startTime: -1 });

    res.status(200).json({ success: true, data: reservations });
  } catch (error) {
    next(error);
  }
};