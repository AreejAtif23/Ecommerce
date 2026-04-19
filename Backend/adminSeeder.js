import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");

    const adminExists = await User.findOne({ 
      email: process.env.ADMIN_EMAIL,
      isAdmin: true 
    });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // Create admin – plain password, model will hash automatically
    await User.create({
      name: "System Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASS,   // plain text
      isAdmin: true,
      isVerified: true
    });

    console.log("✅ Admin account created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin account:");
    console.error(error);
    process.exit(1);
  }
}

createAdmin();







