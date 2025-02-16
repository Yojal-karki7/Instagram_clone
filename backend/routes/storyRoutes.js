import express from 'express';
import { deleteStory, getStories, markStoryAsViewed, uploadStory } from '../controllers/StoryController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multerMemory.js';

const router = express.Router();

router.post('/add', isAuthenticated, upload.single('media'), uploadStory);
router.get('/get', isAuthenticated, getStories);
router.delete('/delete/:id', isAuthenticated, deleteStory);
router.post('/view/:storyId', isAuthenticated, markStoryAsViewed);

export default router;