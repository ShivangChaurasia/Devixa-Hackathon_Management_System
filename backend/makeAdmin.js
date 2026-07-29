import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { User } from './src/modules/auth/auth.model.js';

async function makeAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected.');
    
    const user = await User.findOneAndUpdate(
      { email: 'shiva17ng@gmail.com' },
      { $set: { role: 'ADMIN' } },
      { new: true }
    );
    
    if (user) {
      console.log('Successfully made user admin:');
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
    } else {
      console.log('User with email shiva17ng@gmail.com not found in the database.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

makeAdmin();
