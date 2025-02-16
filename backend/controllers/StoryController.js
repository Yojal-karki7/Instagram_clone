import { getVideoDurationInSeconds } from "get-video-duration";
import  getDataUri  from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import Story from "../models/storyModel.js";
import { User } from "../models/userModel.js";

export const uploadStory = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "File is missing!" });
        }

        const { mimetype } = req.file;
        const fileUri = getDataUri(req.file);

        // Validate video duration (if it's a video)
        if (mimetype.startsWith("video")) {
            const duration = await getVideoDurationInSeconds(fileUri);

            if (duration > 15) {
                return res.status(400).json({ success: false, message: "Video duration exceeds 15 seconds" });
            }
        }

        // Upload to Cloudinary
        const uploadOptions = { resource_type: mimetype.startsWith("video") ? "video" : "image" };
        const result = await cloudinary.uploader.upload(fileUri, uploadOptions);

        if (!result.secure_url) {
            return res.status(500).json({ success: false, message: "Failed to upload to Cloudinary" });
        }

        // Check if `req.id` exists
        if (!req.id) {
            return res.status(401).json({ success: false, message: "Unauthorized. User ID not found!" });
        }
        const story = new Story({
            author: req.id,
            mediaUrl: result.secure_url,
            mediaType: mimetype.startsWith("video") ? "video" : "image"
        });

        console.log({
            author: req.id, 
            mediaUrl: result.secure_url,
            mediaType: mimetype.startsWith("video") ? "video" : "image"
        });
        const savedStory = await story.save();
        console.log("Saving Story - User ID:", req.id);
        console.log("Saved Story:", savedStory);

        if (!savedStory.mediaUrl || !savedStory.mediaType || !savedStory.author) {
            return res.status(500).json({ success: false, message: "Story data not saved correctly!" });
        }

        res.status(201).json({
            success: true,
            message: "Story uploaded successfully",
            story: savedStory
        });

    } catch (error) {
        console.error("Error in uploadStory:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getStories = async (req, res) => {
    try {
        const userId = req.id;
        
        // Find the user and get their following list
        const user = await User.findById(userId).select("following");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // If the user is not following anyone, return an empty array
        if (!user.following || user.following.length === 0) {
            return res.status(200).json({ success: true, stories: [] });
        }

        // Fetch stories from followed users, only within the last 24 hours
        const stories = await Story.find({ 
            author: { $in: user.following }, // ✅ Fixed this line
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
        }).populate('author', 'username profilePicture')
        .populate('viewedBy', 'username profilePicture')
        .sort({ createdAt: -1 });

        res.status(200).json({ success: true, stories });
    } catch (error) {
        console.error("Error fetching stories:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const deleteStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        console.log(story);
        
        if (!story) {
            return res.status(404).json({ success: false, message: 'Story not found' });
        }

        console.log("Authenticated User ID:", req.id);
        console.log("Story Owner ID:", story.user?.toString());

        if (!story.user || story.user.toString() !== req.id.toString()) { 
            return res.status(403).json({ success: false, message: 'Not authorized to delete this story' });
        }

        if (story.mediaUrl) {
            await cloudinary.uploader.destroy(story.mediaUrl);
        }
        
        await story.deleteOne();
        res.status(200).json({ success: true, message: 'Story deleted successfully' });
    } catch (error) {
        console.error("Error in deleteStory:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const markStoryAsViewed = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.id; // Extracted from `isAuthenticated` middleware

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({ success: false, message: "Story not found" });
        }

        // Check if user has already viewed the story
        if (!story.viewedBy.some(id => id.toString() === userId)) {
            story.viewedBy.push(userId);
            await story.save();
        }

        // Return updated story with viewedBy users populated
        const updatedStory = await Story.findById(storyId).populate("viewedBy", "username profilePicture");

        res.status(200).json({ success: true, message: "Story marked as viewed", story: updatedStory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};