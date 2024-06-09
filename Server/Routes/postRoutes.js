import express from 'express';
import { createPost ,getallposts} from '../Controllers/postControllers.js';
// deletePost, getPost, getPosts, updatePost 
const postRoutes = express.Router();


postRoutes.post('/create', createPost);
// postRoutes.delete('/delete', deletePost);
postRoutes.get('/getallposts', getallposts);

// postRoutes.get('/get', getPosts);



export default postRoutes;