import express from 'express';
import { googleAuth, login, sendOtp, verifyOtp, verifyToken, refreshToken ,getRandomUsers } from '../Controllers/AuthControllers.js';
import { auth } from 'google-auth-library';

const authRoutes = express.Router();

authRoutes.post('/google', googleAuth);
authRoutes.post('/SendMail', sendOtp)
authRoutes.post('/verifyCra', verifyOtp);
authRoutes.post('/verifyToken', verifyToken);
authRoutes.post('/login', login);
authRoutes.post('/refresh-token', refreshToken); // Add the refresh token endpoint here
authRoutes.get('/random/users', getRandomUsers );
// authRoutes.post('/follow/:id', followRequest);

export default authRoutes;
