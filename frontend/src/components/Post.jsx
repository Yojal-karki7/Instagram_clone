import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/store/postSlice";
import { Badge } from "./ui/badge";
import { Link, useNavigate } from "react-router-dom";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [openComment, setOpenComment] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post.likes.includes(user._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        const updatedPost = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPost));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setText("");
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/post/${post?._id}/bookmark`, {withCredentials: true});
      if(res.data.success) {
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleLikeOrDislike = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const response = await axios.get(
        `http://localhost:3000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        // update post real time
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error();
    }
  };

  const handleComment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/post/${post._id}/comment`,
        { text },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      if (response.data.success) {
        const updatedCommentData = [...comment, response.data.comment];
        setComment(updatedCommentData);
        const updatedPostCommentData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostCommentData));
        toast.success(response.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyLink = () => {
    const postLink = `http://localhost:5173/post/${post?._id}`; // Adjust the link format as needed
    navigator.clipboard
      .writeText(postLink)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy link.");
        console.error(err);
      });
  };
  return (
    <div className="mb-4 mt-2 w-full max-w-sm lg:max-w-md xl:max-w-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${user._id}`}>
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-semibold">
              {post.author?.username}
              </h1>
            {user._id === post.author._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-center text-sm">
            {
              post?.author?._id !== user?._id && <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            }
            
            <Button onClick={handleBookmark} variant="ghost" className="cursor-pointer w-fit">
              Add to favourites
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-fit"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              Go to Post
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-fit"
              onClick={handleCopyLink}
            >
              Copy link
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              About this account
            </Button>
            {user && user._id === post?.author._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
                onClick={handleDeletePost}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        src={post.image}
        alt="post_img"
        className="rounded-sm my-2 w-full aspect-square object-cover "
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={handleLikeOrDislike}
              size={"22px"}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={handleLikeOrDislike}
              size={"22px"}
              className="cursor-pointer text-gray-600"
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpenComment(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark onClick={handleBookmark} className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block my-1">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      {comment.length > 0 && (
        <span
          className="cursor-pointer text-sm text-gray-500"
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpenComment(true);
          }}
        >
          View all {comment.length} comments
        </span>
      )}
      <CommentDialog
        openComment={openComment}
        setOpenComment={setOpenComment}
      />
      <div className="flex items-center justify-between my-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
          value={text}
          onChange={handleChange}
        />
        {text && (
          <span
            onClick={handleComment}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
