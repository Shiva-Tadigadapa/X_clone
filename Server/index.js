import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/authRoutes.js';
import postRoutes from './Routes/postRoutes.js';
import mongoose from 'mongoose';
dotenv.config();
const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/post', postRoutes);
const connectWithRetry = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Connected to MongoDB 🥳');
    }).catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000); // Retry connection after 5 seconds
    });
};

connectWithRetry();
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
