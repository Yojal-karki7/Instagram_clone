import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { addComment, addNewPost, bookmarkPost, deletePost, disLikedPost, getAllPost, getPostComment, getSinglePost, getUserPosts, likePost } from '../controllers/postController.js';

const router = express.Router();

router.post('/addpost',isAuthenticated, upload.single('image'), addNewPost)
router.get('/all',isAuthenticated, getAllPost)
router.get('/userpost/all',isAuthenticated,getUserPosts)
router.get('/singlepost/:id',getSinglePost)
router.get('/:id/like',isAuthenticated, likePost)
router.get('/:id/dislike',isAuthenticated, disLikedPost)
router.post('/:id/comment',isAuthenticated, addComment)
router.post('/:id/comment/all',isAuthenticated, getPostComment)
router.delete('/delete/:id',isAuthenticated, deletePost)
router.get('/:id/bookmark',isAuthenticated, bookmarkPost)


export default router