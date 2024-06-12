import express from 'express';
import { createPost, getallposts, profile, getPost, createComment, nestedComments ,followRequest,UnfollowRequest,checklogin,CreateLike,RetweetPost,viewInc,getallFollowingposts} from '../Controllers/postControllers.js';
// deletePost, getPost, getPosts, updatePost 
const postRoutes = express.Router();


postRoutes.post('/create', createPost);
// postRoutes.delete('/delete', deletePost);
postRoutes.get('/getallposts', getallposts);
postRoutes.get('/profile/:username', profile);
postRoutes.get('/:postId/:handle', getPost);
postRoutes.post('/comment/:postId/:handle', createComment);
postRoutes.get('/nestedComment', nestedComments);

postRoutes.post('/follow/:id', followRequest);
postRoutes.post('/unfollow/:id', UnfollowRequest);

postRoutes.get('/profile/checklogin/:authId/:userId', checklogin);
postRoutes.post('/:postId/like', CreateLike);
postRoutes.post('/:postId/retweet', RetweetPost);
postRoutes.post('/:postId/view', viewInc);

postRoutes.get('/getfollowPost/:userId/followingPosts', getallFollowingposts);


export default postRoutes;