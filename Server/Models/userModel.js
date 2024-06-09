import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 160,
    },
    location: String,
    website: String,
    birthDate: Date,
    profilePicture: {
        type: String,
    },
    coverPhoto: String,
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    tweets: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
    }],
    likedTweets: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
    }],
    retweetedTweets: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
    }],
    // Add other fields as needed
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
