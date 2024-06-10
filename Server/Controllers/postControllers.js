import PostModel from '../Models/postModel.js';
import UserModel from '../Models/userModel.js';
import { CommentModel } from '../Models/postModel.js';
import mongoose from 'mongoose'; // Import mongoose
const parentId = new mongoose.Types.ObjectId();
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
    const { postId } = req.params;

    try {
        // Find the post by ID and populate author and timeline fields with references
        const checker = await PostModel.findOne({ _id: postId });
        console.log('checker:', checker);
        let post = {};
        let isNested = false;
        if (checker && checker !== null) {
            post = await PostModel.findById(postId)
                .populate({
                    path: 'author',
                    select: '-password', // Exclude the password field from the author details
                })
                .populate({
                    path: 'timeline', // Populate the timeline field with comment references
                    select: '_id comment user createdAt', // Select only the essential fields
                    populate: {
                        path: 'user',
                        select: '-password', // Exclude the password field from the user details
                    }
                });
        } else {
            // If post not found in the post model, check in the comment model
            const checker = await CommentModel.findOne({ _id: postId });
            console.log('comment parentid:', checker.parentPostId);
            post = await CommentModel.findById(postId)
                .populate({
                    path: 'user',
                    select: '-password', // Exclude the password field from the user details
                }).populate({
                    path: 'timeline', // Populate the timeline field with comment references
                    select: '_id comment user createdAt', // Select only the essential fields
                    populate: {
                        path: 'user',
                        select: '-password',
                    }
                }).populate({
                    path: 'parentPostId',
                    select: '_id content author createdAt mediaUrl likes hasComments ',
                    populate: {
                        path: 'author',
                        select: '-password',
                    }
                });
            isNested = true;
        }

        console.log('comment:', post);
        res.status(200).json({
            success: true,
            post: post,
            isNested: isNested
        });
    }
    catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ success: false, message: "Failed to fetch post" });
    }
    // Send the post data along with the timeline (comment references) back to the frontend


};

export const createComment = async (req, res) => {
    const { parentCommentId, userId, content, mediaUrl } = req.body;

    try {
        // Log the value of commentText for debugging
        // console.log("Comment text:", content);

        // Check if comment text is provided
        if (!content) {
            return res.status(400).json({ success: false, message: "Comment text is required" });
        }

        // Create a new comment
        const newComment = new CommentModel({
            user: new mongoose.Types.ObjectId(userId),
            comment: content,
            mediaUrl: mediaUrl || [],
            parentPostId: parentCommentId,
            timeline: []
        });

        // Save the comment
        const savedComment = await newComment.save();

        const checker = await PostModel.findOne({ _id: parentCommentId });
        console.log('checker:', checker);
        const checker2 = await CommentModel.findOne({ _id: parentCommentId });
        console.log('checker2:', checker2);

        let parentType;
        if (parentCommentId) {
            const parentPost = await PostModel.findById(parentCommentId);
            console.log('parentPost:', parentPost);

            if (checker && checker !== null) {
                console.log('parentPost.hasComments: ', parentPost.hasComments);
                parentType = 'post';
                parentPost.hasComments = true;
                parentPost.timeline.push(savedComment._id);
                parentPost.parentPostId = parentCommentId;
                await parentPost.save();
                console.log("Top-level comment added to post", parentPost);
            } else {

            }
        } else {
            parentType = 'post'; // Top-level comment
        }

        res.status(201).json({ success: true, comment: savedComment, parentType });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ success: false, message: "Failed to create comment" });
    }
};


