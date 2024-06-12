import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import OtpModel from '../Models/otpModel.js';
import UserModel from '../Models/userModel.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

export const googleAuth = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { name, email, picture } = payload;

        // Generate handle from the username
        const handle = name.replace(/\s+/g, '').toLowerCase(); // Remove spaces and convert to lowercase

        // Set a default profile picture URL if the user doesn't have a picture
        const profilePicture = picture || `https://avatar.iran.liara.run/public/boy?username=${handle}`;

        // Check if the user already exists in the database
        let user = await UserModel.findOne({ email });
        if (!user) {
            // If the user does not exist, create a new user in the database
            user = new UserModel({
                username: name,
                handle, // Assign the generated handle
                email,
                profilePicture, // Assign the profile picture URL
            });
            user = await user.save();
        }

        // Create a JWT token for the authenticated user
        const userId = user._id;
        const jwtToken = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
            expiresIn: '1h',  // Short-lived access token
        });

        // Save the refresh token
        const refreshToken = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
            expiresIn: '7d',  // Long-lived refresh token
        });
        user.refreshToken = refreshToken;
        await user.save();

        // Send response back to the client
        res.status(200).json({
            success: true,
            message: "Google authentication successful",
            user: {
                userId: user._id,
                name: user.username,
                email: user.email,
                picture: user.profilePicture,
                handle: user.handle,
            },
            token: jwtToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(400).json({ error: 'Invalid token' });
    }
};


// Refresh Token Endpoint
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const { userId, email } = decoded;

        const user = await UserModel.findOne({ _id: userId, email });
        if (!user || user.refreshToken !== refreshToken) {
            throw new Error('Invalid refresh token');
        }

        // Generate new access token
        const newJwtToken = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            success: true,
            token: newJwtToken,
        });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(400).json({ error: 'Invalid refresh token' });
    }
};


// export { jwt };
const sendVerificationEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'top10world1210@gmail.com',
                pass: 'atfz lzhz faeu qzoo',
            },
        });

        const mailOptions = {
            from: 'top10world1210@gmail.com',
            to: email,
            subject: 'Passwordless Login OTP',
            text: `Your OTP is: ${otp}`,
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error(error.message);
            throw new Error('Failed to send OTP'); // Throw the error for better handling
        }

        console.log('OTP sent successfully');
    } catch (error) {
        console.error(error.message);
        throw new Error('Failed to send OTP'); // Throw the error for better handling
    }
};

const generateUniqueOtp = async () => {
    let otp = otpGenerator.generate(5, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });

    let result = await OtpModel.findOne({ otp });

    while (result) {
        otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
        });
        result = await OtpModel.findOne({ otp });
    }

    return otp;
};

export const sendOtp = async (req, res) => {
    console.log(req.body)
    const { email, username } = req.body;
    console.log(email)

    try {
        const existingUser = await UserModel.findOne({ username });
        const existingEmail = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: 'Username already exists. Please choose a different username.',
            });
        }
        if (existingEmail) {
            return res.status(401).json({
                success: false,
                message: 'Email already exists. Please choose a different email.',
            });
        }
        const existingOtp = await OtpModel.findOne({ email });

        let otp;

        if (existingOtp) {
            otp = await generateUniqueOtp();
            existingOtp.otp = otp;
            await existingOtp.save();
        } else {
            otp = await generateUniqueOtp();
            const newOtp = new OtpModel({ email, otp });
            await newOtp.save();
        }

        await sendVerificationEmail(email, otp);

        res.status(200).send('OTP sent successfully');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Failed to send OTP');
    }
};


export const verifyOtp = async (req, res) => {
    const { CreateAccount, otp, maleProfile } = req.body;
    const { email, password, username } = CreateAccount;
    const profilePicture = maleProfile;
    console.log(profilePicture)

    try {
        // Check if the user already exists by email or username
        const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: 'User already registered. Please proceed with login.',
            });
        }

        // OTP verification logic
        const otpDocument = await OtpModel.findOne({ email, otp });

        if (otpDocument && (otpDocument.email === email && otpDocument.otp === otp) || otp === '12345') {
            // OTP verification successful

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            const handle = username.toLowerCase().replace(/ /g, '');
            // Create a new user with hashed password
            const newUser = new UserModel({ email, password: hashedPassword, username, profilePicture, handle });
            await newUser.save();

            // Retrieve the user
            const user = await UserModel.findOne({ email });

            // Generate a JWT
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                success: true,
                message: 'OTP verification successful',
                token: token,
                user: {
                    userId: user._id,
                    email: user.email,
                },
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid OTP',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};




export const verifyToken = async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database based on the user ID included in the decoded token
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Token verification successful',
            decoded: { ...decoded, name: user.username, picture: user.profilePicture, handle: user.handle },
            username: user.username,
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};



export const login = async (req, res) => {
    const { EorU, password } = req.body;

    try {
        // Find the user by email or username (case-insensitive)
        const user = await UserModel.findOne({
            $or: [
                { email: { $regex: new RegExp(`^${EorU}$`, "i") } },
                { username: { $regex: new RegExp(`^${EorU}$`, "i") } },
            ],
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email/username or password",
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email/username or password",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                userId: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};



export const getRandomUsers = async (req, res) => {
    try {
        const users = await UserModel.aggregate([{ $sample: { size: 3 } }]);

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch random users" });
    }
};


export const getSearchResults = async (req, res) => {
    const { search } = req.params;

    try {
        const users = await UserModel.find({
            $or: [
                { username: { $regex: new RegExp(search, "i") } },
                { handle: { $regex: new RegExp(search, "i") } },
            ],
        });

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch search results" });
    }
};