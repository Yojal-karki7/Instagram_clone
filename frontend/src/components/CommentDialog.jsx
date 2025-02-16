import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/store/postSlice";

const CommentDialog = ({ openComment, setOpenComment }) => {

  const [text, setText] = useState('');
  const { selectedPost, posts} = useSelector(store => store.post);
  const [comment, setComment] = useState(selectedPost?.comments)
  const dispatch = useDispatch();

  useEffect(() => {
    if(selectedPost) {
      setComment(selectedPost.comments)
    }
  }, [selectedPost])
  

  const handleChange = (e) => {
    const inputComment = e.target.value;
    if(inputComment.trim()) {
      setText(inputComment)
    } else {
      setText("")
    }
  }
  const handleComment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data.success) {
                setOpenComment(false)
                const updatedCommentData = [...comment, response.data.comment];
                setComment(updatedCommentData);
                const updatedPostCommentData = posts.map(p =>
                  p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
                );
                dispatch(setPosts(updatedPostCommentData));
                toast.success(response.data.message);
                setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={openComment}>
      <DialogContent onInteractOutside={() => setOpenComment(false)} className="max-w-5xl p-0 flex flex-col">
        <div className="flex sm:flex-1 sm:flex-row flex-col sm:h-[60vh]">
          <div className="w-2/2 sm:w-1/2">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-full hidden sm:block object-cover rounded-l-lg"
            />
            </div>
            <div className="sm:w-1/2 w-2/2 flex flex-col">
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-3 items-center">
                <Link>
                <Avatar>
                  <AvatarImage src={selectedPost?.author?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                </Link>
                <div className="">
                    <Link className="font-semibold text-xs">
                    {selectedPost?.author?.username} 
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
              {
                selectedPost?.comments.map((comment) => <Comment key={comment._id} comment={comment} />)
              }
            </div>
            <div className="border-t border-gray-300">
              <div className="flex items-center pt-2">
                <input 
                  type="text"
                  value={text}
                  onChange={handleChange}
                  placeholder="Add a comment..."
                  className="w-full outline-none p-4"
                />
                <Button disabled={!text.trim()} onClick={handleComment} variant="outline" className="border-none text-blue-500">Post</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
