
import express from 'express';
import { googleAuth, login, sendOtp, verifyOtp, verifyToken } from '../Controllers/AuthControllers.js';

const authRoutes = express.Router();

authRoutes.post('/google', googleAuth);
authRoutes.post('/SendMail', sendOtp)
authRoutes.post('/verifyCra', verifyOtp);
authRoutes.post('/verifyToken', verifyToken);
authRoutes.post('/login', login);



export default authRoutes;

