// server.js or index.js

import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 3000;
const CLIENT_ID = '199764480225-1npvvugr55pmnehika7e2dnkmpv42c01.apps.googleusercontent.com';

const client = new OAuth2Client(CLIENT_ID);

app.use(cors());
app.use(bodyParser.json());

app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { name, email, picture } = payload;

        // Here you can create or update the user in your database
        // For now, we will just return the user data

        res.status(200).json({ name, email, picture });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(400).json({ error: 'Invalid token' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
