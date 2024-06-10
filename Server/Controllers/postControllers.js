import PostModel from '../Models/postModel.js';
import UserModel from '../Models/userModel.js';
import { CommentModel } from '../Models/postModel.js';
import mongoose from 'mongoose'; // Import mongoose
const parentId = new mongoose.Types.ObjectId();
const { ObjectId } = mongoose.Types; // Destructure ObjectId from mongoose.Types
export const createPost = async (req, res) => {
    const { content, images, userId } = req.body;
    // console.log('req.body:', req.body);

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
                    options: { sort: { createdAt: -1 } }, // Sort timeline in descending order
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
                })
                .populate({
                    path: 'timeline', // Populate the timeline field with comment references
                    options: { sort: { createdAt: -1 } }, // Sort timeline in descending order
                    select: '_id comment user createdAt', // Select only the essential fields
                    populate: {
                        path: 'user',
                        select: '-password', // Exclude the password field from the user details
                    }
                })
                .populate({
                    path: 'parentPostId',
                    select: '_id content author createdAt mediaUrl likes hasComments',
                    populate: {
                        path: 'author',
                        select: '-password',
                    }
                });
            isNested = true;
        }

        // Send the post data along with the timeline (comment references) back to the frontend
        res.status(200).json({
            success: true,
            post: post,
            isNested: isNested
        });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ success: false, message: "Failed to fetch post" });
    }
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
        // console.log('checker:', checker);
        const checker2 = await CommentModel.findOne({ _id: parentCommentId });
        // console.log('checker2:', checker2);

        let parentType;
        if (parentCommentId) {
            const parentPost = await PostModel.findById(parentCommentId);
            // console.log('parentPost:', parentPost);

            if (checker && checker !== null) {
                // console.log('parentPost.hasComments: ', parentPost.hasComments);
                parentType = 'post';
                parentPost.hasComments = true;
                parentPost.timeline.push(savedComment._id);
                parentPost.parentPostId = parentCommentId;
                await parentPost.save();
                // console.log("Top-level comment added to post", parentPost);
            } else {
                // console.log('parentPost.hasComments: ', parentCommentId);
                parentType = 'comment';
                const parentPost = await CommentModel.findById(parentCommentId);
                parentPost.hasComments = true;
                parentPost.timeline.push(savedComment._id);
                parentPost.parentPostId = parentCommentId;
                await parentPost.save();
                // console.log("Nested comment added to comment", parentPost);
            
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


export const nestedComments = async (req, res) => {
    try {
        const { nestedComments } = req.query;
        console.log('nested:', nestedComments);

        const nestedCommentsArray = JSON.parse(nestedComments);
        const populatedComments = await CommentModel.find({ _id: { $in: nestedCommentsArray } })
            .populate({
                path: 'user',
                select: '-password', // Exclude the password field from the user details
            });

        res.status(200).json({
            success: true,
            nestedComments: populatedComments,
        });
    } catch (error) {
        console.error("Error fetching nested comments:", error);
        res.status(500).json({ success: false, message: "Failed to fetch nested comments" });
    }
};


export const followRequest = async (req, res) => {
    const { id } = req.params; // ID of the user to be followed
    const { follower } = req.body; // ID of the follower

    console.log("User to be followed:", id);
    console.log("Follower:", follower);

    try {
        // Find the user to be followed
        const userToBeFollowed = await UserModel.findById(id);
        if (!userToBeFollowed) {
            return res.status(404).json({
                success: false,
                message: "User to be followed not found",
            });
        }

        // Find the follower
        const followerUser = await UserModel.findById(follower);
        if (!followerUser) {
            return res.status(404).json({
                success: false,
                message: "Follower user not found",
            });
        }

        // Check if already following
        if (userToBeFollowed.followers.includes(follower) || followerUser.following.includes(id)) {
            return res.status(400).json({
                success: false,
                message: "User is already following",
            });
        }

        // Add follower to the user's followers array
        userToBeFollowed.followers.push(follower);

        // Add user to the follower's following array
        followerUser.following.push(id);

        // Save both users
        await userToBeFollowed.save();
        await followerUser.save();

        res.status(200).json({
            success: true,
            message: "Successfully followed the user",
            userToBeFollowed,
            followerUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const UnfollowRequest = async (req, res) => {
    const { id } = req.params; // the ID of the user to be unfollowed
    const { follower } = req.body; // the ID of the user who is unfollowing
    console.log(id, follower);
  
    try {
      // Find the user to be unfollowed
      const userToUnfollow = await UserModel.findById(id);
  
      // Find the follower
      const followerUser = await UserModel.findById(follower);
  
      if (!userToUnfollow || !followerUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Remove followerUser from the userToUnfollow's followers list
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (followerId) => followerId.toString() !== follower.toString()
      );
  
      // Remove userToUnfollow from the followerUser's following list
      followerUser.following = followerUser.following.filter(
        (followingId) => followingId.toString() !== id.toString()
      );
  
      // Save both users
      await userToUnfollow.save();
      await followerUser.save();
  
      res.status(200).json({
        success: true,
        message: "Unfollowed successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  

export const checklogin = async (req, res) => {
    const { authId, userId } = req.params;

    try {
        const user = await  UserModel.findById(authId);
        const userProfile = await UserModel.findById(userId);
        let isFollowing = false;
        if (userProfile.followers.includes(authId)) {
            isFollowing = true;
        }
        res.status(200).json({ success: true, isFollowing });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
