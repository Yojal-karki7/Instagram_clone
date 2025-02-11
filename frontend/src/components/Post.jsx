import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";

const Post = () => {
    const [text, setText] = useState('');
    const [openComment, setOpenComment] = useState(false)
    const handleChange = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()) {
            setText(inputText)
        }
        else{
            setText('')
        }
    }
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>username</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-center text-sm">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favourites
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Go to Post
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Copy link
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              About this account
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        src="https://i.pinimg.com/736x/90/82/4a/90824a8c90db9fc84435b63083fd7c15.jpg"
        alt="post_img"
        className="rounded-sm my-2 w-full aspect-square object-cover"
      />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaRegHeart size={"22px"} className="cursor-pointer text-gray-600"/>
            <MessageCircle onClick={()=>setOpenComment(true)} className="cursor-pointer hover:text-gray-600" />
            <Send className="cursor-pointer hover:text-gray-600" />
        </div>
      <Bookmark className="cursor-pointer hover:text-gray-600"/>
      </div>
        <span className="font-medium block my-1">1k likes</span>
        <p >
            <span className="font-medium mr-2">username</span>
            caption
        </p>
        <span className="cursor-pointer text-sm text-gray-500" onClick={()=>setOpenComment(true)} >View all 10 comments</span>
        <CommentDialog openComment={openComment} setOpenComment={setOpenComment}/>
        <div className="flex items-center justify-between my-2">
            <input 
            type="text"
            placeholder="Add a comment..."
            className="outline-none text-sm w-full"
            value={text}
            onChange={handleChange}
            />
            {
                text && <span className="text-[#3BADF8]">Post</span>
            }
            
        </div>
    </div>
  );
};

export default Post;
