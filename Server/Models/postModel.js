import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the comment schema separately to allow recursion
const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming your user model is named 'User'
        required: true,
    },
    comment: {
        type: String,
        required: true,
        maxlength: 200,
    },
    mediaUrl: {
        type: [String],
    },
    hasComments: {
        type: Boolean,
        default: false,
    },
    timeline: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    parentPostId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
}, { timestamps: true });

const CommentModel = mongoose.model('Comment', commentSchema);

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
    timeline: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    retweets: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    hasComments: {
        type: Boolean,
        default: false,
    },
    parentPostId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
    hashtags: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

postSchema.index({
    author: 1,
    createdAt: 1,
});

const PostModel = mongoose.model('Post', postSchema);

export default PostModel;
export { CommentModel };
