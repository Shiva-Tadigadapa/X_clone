import express from 'express';
import { createPost ,getallposts ,profile} from '../Controllers/postControllers.js';
// deletePost, getPost, getPosts, updatePost 
const postRoutes = express.Router();


postRoutes.post('/create', createPost);
// postRoutes.delete('/delete', deletePost);
postRoutes.get('/getallposts', getallposts);
postRoutes.get('/profile/:username', profile);

// postRoutes.get('/get', getPosts);



export default postRoutes;