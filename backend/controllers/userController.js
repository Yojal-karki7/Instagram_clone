import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/postModel.js";

export const register = async(req, res)=>{
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password) {
            return res.status(401).json({
                success: false,
                message: 'Something is missing, please check!'
            })
        }
        const user = await User.findOne({email});
        if(user) {
            return res.status(401).json({
                message: 'Try different email!',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            username,
            email,
            password: hashedPassword,
        });
        return res.status(201).json({
            message: 'Account created successfully!',
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

export const login = async(req, res) =>{
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(401).json({
                success: false,
                message: 'Something is missing, please check!'
            })
        }
        let user = await User.findOne({email})
        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password, please check!'
            })
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if(!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password, please check!'
            })
        }
        
        const token = await jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})

        // populate each post in the post array
        const populatedPost = await Promise.all(
            user.posts.map(async(postId)=> {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        )

        user = {
            _id: user._id,
            username: user.username,
            email:user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPost,
        }
        return res.cookie('token', token, {httpOnly: true, sameSite:'strict', maxAge: 1*24*60*60*1000}).json({
            message: 'Logged in Successfully!',
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const logout = async(req, res) =>{
    try {
        return res.cookie('token', '', {maxAge: 0}).json({
            success: true,
            message: 'Logged Out Successfully!'
        })
    } catch (error) {
        console.log(error);
    }
}

export const getProfile = async (req, res)=>{
    try {
        const userId = req.params.id;

        let user = await User.findById(userId).select("-password");
        return res.status(200).json({
            user,
            success: true,
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const editProfile = async(req, res) => {
    try {
         const userId = req.id;
         const {bio, gender} = req.body
         const profilePicture = req.file;
         let cloudResponse;

         if(profilePicture) {
            const fileUri = getDataUri(profilePicture);
           cloudResponse =  await cloudinary.uploader.upload(fileUri);
         }
         const user = await User.findById(userId).select('-password');
         if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
         }
         if(bio) user.bio = bio;
         if(gender) user.gender = gender;
         if(profilePicture) user.profilePicture = cloudResponse.secure_url;
         await user.save();

         return res.status(200).json({
            message: 'Profile Updated!',
            success: true,
            user
         })
         
    } catch (error) {
        console.log(error);     
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
      const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
      if(!suggestedUsers) {
        return res.status(400).json({
            message: 'Currently do not have any users!',
            success: false,
        })
      }
      return res.status(200).json({
        success: true,
        suggestedUsers
      })
    } catch (error) {
        console.log(error);
    }
}

export const followOrUnfollow = async(req, res) => {
    try {
         const follower = req.id;   // current user   
         const following = req.params.id;
         if(follower === following) {
            return res.status(400).json({
                message: 'You cannot follow your self!',
                success: true,
            })
         }
         const user = await User.findById(follower);
         const targetUser = await User.findById(following);

         if(!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found!',
                success: false,
            })
         }
        //  Now check whether to follow or unfollow
        const isFollowing = user.following.includes(following);
        if(isFollowing) {
            // unfollow logic
            await Promise.all([
            User.updateOne({_id: follower}, {$pull:{following:following}}),
            User.updateOne({_id: following}, {$pull:{followers:follower}}),
            ])
            return res.status(200).json({
                message: 'Unfollowed Successfully!',
                success: true,
            })
        }
        else {
            // follow logic
            await Promise.all([
                User.updateOne({_id: follower}, {$push:{following:following}}),
                User.updateOne({_id: following}, {$push:{followers:follower}}),
            ])
            return res.status(200).json({
                message: 'Followed Successfully!',
                success: true,
            })
        }
    } catch (error) {
        console.log(error);
    }
}