/**
 * Script to create an admin user
 * Usage: node scripts/createAdmin.js <email> <password> <name>
 */

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fisheries-learning-hub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || 'Admin User';

    if (!email || !password) {
      console.error('Usage: node scripts/createAdmin.js <email> <password> [name]');
      process.exit(1);
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log('Admin user already exists with this email.');
        process.exit(0);
      } else {
        // Update to admin
        existingUser.role = 'admin';
        existingUser.password = password; // Will be hashed by pre-save hook
        await existingUser.save();
        console.log('User updated to admin successfully!');
        process.exit(0);
      }
    }

    // Create new admin user
    const admin = new User({
      name,
      email,
      password,
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Role: admin`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

