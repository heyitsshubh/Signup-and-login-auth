import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri: string | undefined = process.env.MONGO_URI;

async function connectToMongoDB(): Promise<void> {
    if (!uri) {
        console.error("Error: MONGO_URI is not defined in the environment.");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, {
        });
        console.log("Connected to MongoDB successfully!");
    } catch (error: any) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

export { connectToMongoDB };

