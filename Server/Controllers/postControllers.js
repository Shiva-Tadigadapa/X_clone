import PostModel from '../Models/postModel.js';
import UserModel from '../Models/userModel.js';
import mongoose from 'mongoose'; // Import mongoose

const { ObjectId } = mongoose.Types; // Destructure ObjectId from mongoose.Types
export const createPost = async (req, res) => {
    const { content, images, userId } = req.body;
    console.log('req.body:', req.body);

    try {
        const mediaUrl = images.map((image) => image.url);
        const author = userId;

        const newPost = new PostModel({ author, content, mediaUrl });
        await newPost.save();
        res.status(200).json({ success: true, message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Failed to create post' });
    }
};


export const getallposts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('author').sort({ createdAt: -1 });
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch posts' });
    }
};

export const profile = async (req, res) => {
    const { username } = req.params;
    const handle = username;

    try {
        const userProfileWithPosts = await UserModel.aggregate([
            { $match: { handle } }, // Find the user by username
            {
                $lookup: {
                    from: "posts", // Name of the posts collection
                    let: { userId: "$_id" }, // Pass user ID to the pipeline
                    pipeline: [
                        { $match: { $expr: { $eq: ["$author", "$$userId"] } } }, // Match posts where author matches the user ID
                        { $sort: { createdAt: -1 } } // Sort posts by creation date in descending order
                    ],
                    as: "posts" // Output the joined posts to this field
                }
            }
        ]);

        // Check if userProfileWithPosts is empty or user not found
        if (!userProfileWithPosts || userProfileWithPosts.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, userProfile: userProfileWithPosts[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Failed to fetch user profile" });
    }
};


export const getPost = async (req, res) => {
    const { postId, handle } = req.params;

    try {
        // Aggregate pipeline to fetch post details along with author's details
        const postWithAuthor = await PostModel.aggregate([
            { $match: { _id: new ObjectId(postId) } }, // Convert postId to ObjectId
            {
                $lookup: {
                    from: 'users',
                    let: { authorId: '$author' }, // Use let to capture the author ID
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$authorId'] } } }, // Match users by author ID
                        { $project: { password: 0 } } // Exclude password field from the result
                    ],
                    as: 'authorDetails'
                }
            },
            { $unwind: '$authorDetails' } // Deconstruct the authorDetails array
        ]);

        if (!postWithAuthor || postWithAuthor.length === 0) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Send the combined data back to the frontend
        res.status(200).json({
            success: true,
            post: postWithAuthor[0],
        });
    } catch (error) {
        console.error("Error fetching post and user profile:", error);
        res.status(500).json({ success: false, message: "Failed to fetch post and user profile" });
    }
};

export const createComment = async (req, res) => {
    const { postId, handle } = req.params;
    const { userId, comment } = req.body;

    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        post.comments.push({ user: userId, comment });
        await post.save();
        res.status(200).json({ success: true, message: "Comment added successfully", post });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ success: false, message: "Failed to add comment" });
    }
}
