import express from 'express';
import { createPost ,getallposts ,profile,getPost,createComment} from '../Controllers/postControllers.js';
// deletePost, getPost, getPosts, updatePost 
const postRoutes = express.Router();


postRoutes.post('/create', createPost);
// postRoutes.delete('/delete', deletePost);
postRoutes.get('/getallposts', getallposts);
postRoutes.get('/profile/:username', profile);
postRoutes.get('/:postId/:handle', getPost);
postRoutes.post('/comment/postId/:handle', createComment);
// postRoutes.get('/get', getPosts);



export default postRoutes;