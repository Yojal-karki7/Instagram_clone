import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket.io/socket.js";
import {User} from '../models/userModel.js'

export const sendMessage = async(req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const {textMessage:message} = req.body;
        

        let conversation = await Conversation.findOne({
            participants:{
                $all:[senderId, receiverId]
            }
        });
        // establish the conversation if not started yet
        if(!conversation) {
            conversation = await Conversation.create({
            participants:[senderId, receiverId]
           })
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })
        if(newMessage) conversation.messages.push(newMessage._id);
        
        await Promise.all([conversation.save(), newMessage.save()]);

        // implement socket.io for real time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log("Receiver Socket ID:", receiverSocketId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        
        const sender = await User.findById(senderId).select("username profilePicture");

        // Create a message notification object
        const notification = {
            type: "message",
            senderId,
            senderDetails: sender,
            receiverId,
            messageId: newMessage._id,
            text: message,
            timestamp: new Date(),
        };

        // Emit real-time message notification
        console.log("Emitting messageNotification to:", receiverSocketId, notification);
        io.to(receiverSocketId).emit("messageNotification", notification);
    }
        return res.status(200).json({
            success: true,
            newMessage
        })
    }
        catch (error) {
            console.log(error);
        }
}

export const getMessage = async (req, res) =>{
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: {$all:[senderId, receiverId]}
        }).populate('messages')
        if(!conversation) {
            return res.status(200).json({
                success:false,
                messages: [],
            })
        }
        return res.status(200).json({
            success: true,
            messages:conversation.messages,
        })
    } catch (error) {
        console.log(error);
    }
}