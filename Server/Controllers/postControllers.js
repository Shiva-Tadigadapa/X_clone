import PostModel from '../Models/postModel.js';

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