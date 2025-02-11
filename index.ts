import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectToMongoDB } from './Connect';
import authRoutes from './Routes/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Connect to MongoDB
connectToMongoDB();

// Define routes
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});