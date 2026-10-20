import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@restaurant.com',
      password: 'AdminPassword123!',
      role: 'admin',
      isActive: true,
    });

    console.log(`Admin created successfully: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();