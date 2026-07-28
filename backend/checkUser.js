import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

async function checkUser() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
    
    // We don't have the exact path for User model in the script context, so we'll just connect directly
    // and query the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({ email: 'shiva17ng@gmail.com' });
    
    if (user) {
      console.log('User found:');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('User not found with email: shiva17ng@gmail.com');
    }
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkUser();
