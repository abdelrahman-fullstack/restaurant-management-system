import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RestaurantTable',
      required: true,
    },
    partySize: {
      type: Number,
      required: true,
      min: 1,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'seated', 'completed', 'cancelled', 'no_show'],
      default: 'confirmed',
    },
    notes: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

reservationSchema.index({ table: 1, startTime: 1, endTime: 1, status: 1 });

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;