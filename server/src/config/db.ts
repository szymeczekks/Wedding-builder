import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://szymon:szymon@cluster0.kmrajff.mongodb.net/dnd';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Mongo connected!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}