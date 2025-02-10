import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { addComment, addNewPost, bookmarkPost, deletePost, disLikedPost, getAllPost, getPostComment, getUserPosts, likePost } from '../controllers/postController.js';

const router = express.Router();

router.post('/addpost',isAuthenticated, upload.single('image'), addNewPost)
router.get('/all',isAuthenticated, getAllPost)
router.get('/userpost/all',isAuthenticated,getUserPosts)
router.post('/:id/like',isAuthenticated, likePost)
router.post('/:id/dislike',isAuthenticated, disLikedPost)
router.get('/:id/comment',isAuthenticated, addComment)
router.get('/:id/comment/all',isAuthenticated, getPostComment)
router.get('/delete/:id',isAuthenticated, deletePost)
router.get('/:id/bookmark',isAuthenticated, bookmarkPost)


export default router