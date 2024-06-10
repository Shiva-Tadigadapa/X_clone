import PostModel from '../Models/postModel.js';
import UserModel from '../Models/userModel.js';
import { CommentModel } from '../Models/postModel.js';
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
    const { postId } = req.params;

    try {
        console.log(`Fetching post with ID: ${postId}`);

        // Aggregate pipeline to fetch post details along with author's details and comments
        let postWithComments = await PostModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(postId) } }, // Match post by ID
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorDetails'
                }
            },
            { $unwind: '$authorDetails' }, // Deconstruct the authorDetails array
            {
                $lookup: {
                    from: 'comments',
                    localField: 'comments',
                    foreignField: '_id',
                    as: 'commentDocs'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'commentDocs.user',
                    foreignField: '_id',
                    as: 'commentUsers'
                }
            },
            {
                $addFields: {
                    comments: {
                        $map: {
                            input: '$commentDocs',
                            as: 'comment',
                            in: {
                                $mergeObjects: [
                                    '$$comment',
                                    {
                                        userDetails: {
                                            $arrayElemAt: [
                                                '$commentUsers',
                                                { $indexOfArray: ['$commentUsers._id', '$$comment.user'] }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    comments: {
                        $filter: {
                            input: '$comments',
                            as: 'comment',
                            cond: { $ne: ['$$comment.userDetails', null] } // Filter out comments without userDetails
                        }
                    }
                }
            },
            {
                $project: {
                    authorDetails: {
                        $mergeObjects: [
                            '$authorDetails',
                            { password: '$$REMOVE' } // Exclude the password field
                        ]
                    },
                    content: 1,
                    mediaUrl: 1,
                    likes: 1,
                    comments: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $addFields: {
                    comments: {
                        $reverseArray: '$comments' // Reverse the order of comments to make the latest first
                    }
                }
            }
        ]);

        console.log('Post with comments:', postWithComments);

        // Check if postWithComments is empty or post not found
        let nestedComment = false;
        if (!postWithComments || postWithComments.length === 0) {
            console.log('Post not found, checking nested comments');
            // Search for posts within comments
            postWithComments = await PostModel.aggregate([
                { $match: { 'comments': new mongoose.Types.ObjectId(postId) } }, // Match post by comment ID
                { $unwind: '$comments' }, // Deconstruct the comments array
                { $match: { 'comments': new mongoose.Types.ObjectId(postId) } }, // Match the specific comment by ID
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'authorDetails'
                    }
                },
                { $unwind: '$authorDetails' }, // Deconstruct the authorDetails array
                {
                    $lookup: {
                        from: 'comments',
                        localField: 'comments',
                        foreignField: '_id',
                        as: 'commentDocs'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'commentDocs.user',
                        foreignField: '_id',
                        as: 'commentUsers'
                    }
                },
                {
                    $addFields: {
                        comments: {
                            $map: {
                                input: '$commentDocs',
                                as: 'comment',
                                in: {
                                    $mergeObjects: [
                                        '$$comment',
                                        {
                                            userDetails: {
                                                $arrayElemAt: [
                                                    '$commentUsers',
                                                    { $indexOfArray: ['$commentUsers._id', '$$comment.user'] }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        comments: {
                            $filter: {
                                input: '$comments',
                                as: 'comment',
                                cond: { $ne: ['$$comment.userDetails', null] } // Filter out comments without userDetails
                            }
                        }
                    }
                },
                {
                    $project: {
                        authorDetails: {
                            $mergeObjects: [
                                '$authorDetails',
                                { password: '$$REMOVE' } // Exclude the password field
                            ]
                        },
                        content: 1,
                        mediaUrl: 1,
                        likes: 1,
                        comments: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]);

            nestedComment = postWithComments.length > 0; // Set nestedComment to true if a post was found
        }

        console.log('Post with nested comments:', postWithComments);

        // Check if postWithComments is still empty or post not found
        if (!postWithComments || postWithComments.length === 0) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Add nestedComment field to the response
        const postResponse = postWithComments[0];
        if (nestedComment) {
            postResponse.nestedComment = true;
        }

        // Send the combined data back to the frontend
        res.status(200).json({
            success: true,
            post: postResponse,
        });
    } catch (error) {
        console.error("Error fetching post and user profile:", error);
        res.status(500).json({ success: false, message: "Failed to fetch post" });
    }
};







export const createComment = async (req, res) => {
    const { postId } = req.params;
    const { userId, content, images, parentCommentId } = req.body; // Added parentCommentId

    console.log('req.body:', req.body);
    console.log('req.params:', req.params);

    try {
        const mediaUrl = images ? images.map((image) => image.url) : [];

        // Check if postId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ success: false, message: "Invalid post ID" });
        }

        // Create a new comment
        const newComment = new CommentModel({
            user: userId,
            comment: content,
            mediaUrl: mediaUrl,
        });

        let post = await PostModel.findById(postId);

        if (post) {
            // Add the new comment to the post
            post.comments.push(newComment._id);
            await post.save();
        } else {
            // Check if it's a nested comment
            if (parentCommentId) {
                // Check if parentCommentId is a valid ObjectId
                if (!mongoose.Types.ObjectId.isValid(parentCommentId)) {
                    return res.status(400).json({ success: false, message: "Invalid parent comment ID" });
                }

                // Find the parent comment
                const parentComment = await CommentModel.findById(parentCommentId);
                if (parentComment) {
                    // Add the new comment as a reply to the parent comment
                    parentComment.replies.push(newComment._id);
                    await parentComment.save();
                } else {
                    // If parent comment is not found, check within nested comments in PostModel
                    post = await PostModel.findOne({ "comments._id": parentCommentId });
                    if (post) {
                        post.comments.push(newComment._id);
                        await post.save();
                    } else {
                        return res.status(404).json({ success: false, message: "Post not found" });
                    }
                }
            } else {
                return res.status(404).json({ success: false, message: "Post not found" });
            }
        }

        // Save the new comment
        await newComment.save();

        res.status(200).json({ success: true, message: "Comment added successfully", comment: newComment });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ success: false, message: "Failed to add comment" });
    }
};

