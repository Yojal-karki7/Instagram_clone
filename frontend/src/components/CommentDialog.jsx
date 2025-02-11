import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const CommentDialog = ({ openComment, setOpenComment }) => {

  const [comment, setComment] = useState('');

  const handleChange = (e) => {
    const inputComment = e.target.value;
    if(inputComment.trim()) {
      setComment(inputComment)
    } else {
      setComment("")
    }
  }
  const handleComment = async() => {
    alert(comment)
  }
  return (
    <Dialog open={openComment}>
      <DialogContent onInteractOutside={() => setOpenComment(false)} className="max-w-5xl p-0 flex flex-col">
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src="https://i.pinimg.com/736x/90/82/4a/90824a8c90db9fc84435b63083fd7c15.jpg"
              alt="post_img"
              className="w-full h-full object-cover rounded-l-lg"
            />
            </div>
            <div className="w-1/2 flex flex-col">
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-3 items-center">
                <Link>
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                </Link>
                <div className="">
                    <Link className="font-semibold text-xs">
                    username
                    </Link>
                    {/* <span className="text-gray-600 text-sm">Bio here...</span> */}
                </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer"/>
                  </DialogTrigger>
                  <DialogContent className='flex flex-col items-center text-sm text-center'>
                    <div className="cursor-pointer pb-2 w-full text-[#ED4956] font-bold border-b border-gray-300">
                      Unfollow
                    </div>
                    <div className="cursor-pointer pb-2 w-full border-b border-gray-300">
                      Add to favourites
                    </div>
                    <div className="cursor-pointer pb-2 w-full border-b border-gray-300">
                      Go to post
                    </div>
                    <div className="cursor-pointer pb-2 w-full border-b border-gray-300">
                      Copy link
                    </div>
                    <div className="cursor-pointer pb-2 w-full border-b border-gray-300">
                      About this account
                    </div>
                    <div className="cursor-pointer w-full">
                      Cancel
                    </div>
                  </DialogContent>
                </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              Comments
            </div>
            <div className="border-t border-gray-300">
              <div className="flex items-center pt-2">
                <input 
                  type="text"
                  value={comment}
                  onChange={handleChange}
                  placeholder="Add a comment..."
                  className="w-full outline-none p-4"
                />
                <Button disabled={!comment.trim()} onClick={handleComment} variant="outline" className="border-none text-blue-500">Post</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
