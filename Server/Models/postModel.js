import { time, timeStamp } from "console";
import mongoose from "mongoose";
import { type } from "os";

const { Schema } = mongoose;


const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        maxlength: 500,
    },
    mediaUrl: {
        type: [String],
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    Comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: ' User',
            required: true,
        },
        comment: {
            type: String,
            required: true,
            maxlength: 200,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true, })

postSchema.index({
    author: 1,
    createdAt: +1,
});

postSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const PostModel = mongoose.model('Post', postSchema);

export default PostModel;
