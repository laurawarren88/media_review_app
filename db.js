import mongoose from 'mongoose';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); 
    }
};

export default connectDB;