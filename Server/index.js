import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
cors();


const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(express.json());

app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userId = payload['sub'];

        // Find or create the user in your database
        // For example:
        // const user = await User.findOrCreate({ googleId: userId });

        res.status(200).json({ message: 'User authenticated', user: payload });
    } catch (error) {
        res.status(400).json({ error: 'Token verification failed' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
