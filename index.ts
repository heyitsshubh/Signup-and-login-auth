import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectToMongoDB } from './Connect';
import authRoutes from './Routes/auth';
import { errorHandler } from './Middlewares/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

connectToMongoDB();


app.use('/api/auth', authRoutes);

// Error handling middleware (should be after all routes)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});