import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { User } from './src/modules/auth/auth.model.js';

async function checkUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected.');
    
    const user = await User.findOne({ email: 'shiva17ng@gmail.com' });
    
    if (user) {
      console.log('--- User found ---');
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Provider:', user.provider);
      console.log('Onboarded:', user.isOnboarded);
    } else {
      console.log('User with email shiva17ng@gmail.com not found in the database.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkUser();
