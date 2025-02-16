import express from 'express'
import { editProfile, followOrUnfollow, getFollowingUsers, getProfile, getSuggestedUsers, login, logout, register } from '../controllers/userController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout)
router.get('/:id/profile',isAuthenticated, getProfile);
router.post('/profile/edit', isAuthenticated,upload.single('profilePhoto'), editProfile);
router.get('/suggested', isAuthenticated, getSuggestedUsers)
router.post('/followorunfollow/:id', isAuthenticated, followOrUnfollow);
router.get("/following", isAuthenticated, getFollowingUsers);

export default router
