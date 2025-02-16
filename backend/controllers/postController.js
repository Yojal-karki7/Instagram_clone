import sharp from 'sharp'
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/postModel.js';
import { User } from '../models/userModel.js';
import { Comment } from '../models/commentModel.js';
import { getReceiverSocketId, io } from '../socket.io/socket.js';

export const addNewPost = async(req, res) =>{
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;

        if(!image) {
            return res.status(400).json({
                message: 'Image required!',
                success: false,
            })
        }
        //  Image upload.
        const optimizedImageBuffer = await sharp(image.buffer).resize({width: 800, height:800, fit:'inside'}).toFormat('jpeg', {quality: 80}).toBuffer();
        // buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

        const cloudinaryResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudinaryResponse.secure_url,
            author: authorId,
        })

        const user = await User.findById(authorId);

        if(user) {
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({
            path: 'author',
            select:'-password',
        })
        return res.status(201).json({
            success: true,
            message:'Post has been uploaded!',
            post,
        })
    } catch (error) {     
        console.log(error);
    }
}

export const getAllPost = async(req, res) =>{
    try {
        const posts = await Post.find().sort({createdAt: -1 }).populate({
            path: 'author',
            select:'username profilePicture'}).populate({
                path: 'comments',
                sort:{createdAt: -1},
                populate:{
                    path: 'author',
                    select:'username profilePicture'
                }
            });
            return res.status(200).json({
                posts,
                success: true
            })
    } catch (error) {
        console.log(error);
        
    }
};

export const getSinglePost = async(req, res) => {
    try {
        const postId = req.params.id;
        console.log(postId);
        
        const post = await Post.findById(postId).sort({createdAt: -1 }).populate({
            path: 'author',
            select:'username profilePicture'}).populate({
                path: 'comments',
                sort:{createdAt: -1},
                populate:{
                    path: 'author',
                    select:'username profilePicture'
                }
            });
        if(!post) {
            return res.status(400).json({
                message: 'Post not found!',
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            post,
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const getUserPosts = async(req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt: -1}).populate({
            path: 'author',
            select: 'username profilePicture'
        }).populate({
            path: 'comments',
                sort:{createdAt: -1},
                populate:{
                    path: 'author',
                    select:'username profilePicture'
                }
        })
            return res.status(200).json({
                posts,
                success: true
            })
    } catch (error) {
        console.log(error);
    }
}

export const likePost = async(req, res) => {
    try {
        const liker = req.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: 'Post not found!',
                success: false
            })
        }
        // like logic 
        await post.updateOne({$addToSet:{likes:liker}});
        await post.save();

        // Implement socket io for real time notification
        const user = await User.findById(liker).select('username profilePicture')
        const postOwnerId = post.author.toString();
        if(postOwnerId !== liker) {
            // emit a notification event
            const notification = {
                type: 'like',
                userId:liker,
                userDetails:user,
                postId,
                message: `Your post was liked by ${user?.username}`
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification)
        }
        return res.status(200).json({
            message: 'Post liked!',
            success: true,
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const disLikedPost = async(req, res) => {
    try {
        const liker = req.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: 'Post not found!',
                success: false
            })
        }
        // like logic 
        await post.updateOne({$pull:{likes:liker}});
        await post.save();

        // Implement socket io for real time notification
        const user = await User.findById(liker).select('username profilePicture')
        const postOwnerId = post.author.toString();
        if(postOwnerId !== liker) {
            // emit a notification event
            const notification = {
                type: 'dislike',
                userId:liker,
                userDetails:user,
                postId,
                message: `Your post was disliked by ${user?.username}`
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification)
        }
        return res.status(200).json({
            message: 'Post disLiked!',
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

export const addComment = async(req, res) => {
    try {
        const postId = req.params.id;
        const commenter = req.id;
        const {text} = req.body;

        const post = await Post.findById(postId);
        if(!text) {
            return res.status(400).json({
                message: 'Cannot comment with empty field!',
                success: false
            })
        }

        const comment = await Comment.create({
            text,
            author: commenter,
            post: postId
        })

        await comment.populate({
            path: 'author',
            select: 'username profilePicture'
        })
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: 'Comment Added!',
            success: true,
            comment,
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const getPostComment = async(req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({post:postId}).populate({
            path: 'author',
            select: 'username profilePicture'
        });
        if(!comments) {
            return res.status(200).json({
                message: 'No comments Yet!',
            })
        }

        return res.status(200).json({
            success:true,
            comments,
        })
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async(req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: 'Post not found!',
                success: false
            })
        }
        // check if the logged in user is the owner of the post
        if(post.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized!',
                success: false,
            })
        }
        // delete post
        await Post.findByIdAndDelete(postId)

        // remove the post from user's posts

        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId)
        await user.save();

        // delete associated comments
        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            message: 'Post deleted!',
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}

export const bookmarkPost = async(req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: 'Post not found!',
                success: false
            })
        }

        const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)) {
            // remove from bookmark
            await user.updateOne({$pull: {bookmarks: post._id}});
            await user.save()
            return res.status(200).json({type:'unsaved', message: 'Post removed from bookmarks!', success: true})
        } else {
            // add to bookmark
            await user.updateOne({$addToSet: {bookmarks: post._id}});
            await user.save()
            return res.status(200).json({type:'saved', message: 'Post bookmarked!', success: true})
        }
    } catch (error) {
        console.log(error);
        
    }
}