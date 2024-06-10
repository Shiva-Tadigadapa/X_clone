
import express from 'express';
import { googleAuth, login, sendOtp, verifyOtp, verifyToken } from '../Controllers/AuthControllers.js';
import { auth } from 'google-auth-library';

const authRoutes = express.Router();

authRoutes.post('/google', googleAuth);
authRoutes.post('/SendMail', sendOtp)
authRoutes.post('/verifyCra', verifyOtp);
authRoutes.post('/verifyToken', verifyToken);
authRoutes.post('/login', login);
// authRoutes.post('/follow/:id', followRequest);



export default authRoutes;

