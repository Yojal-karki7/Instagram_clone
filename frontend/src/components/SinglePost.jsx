import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Bookmark, MessageCircle, Send, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import CommentDialog from "./CommentDialog";
import { Button } from "../components/ui/button";
import { setPosts } from "@/store/postSlice";

const SinglePost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);
  const user = useSelector((state) => state.auth.user);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openComment, setOpenComment] = useState(false);
  const [text, setText] = useState("");
  const [postLike, setPostLike] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/post/singlepost/${id}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setPost(response.data.post);
          setPostLike(response.data.post.likes.length);
          setLiked(response.data.post.likes.includes(user._id));
        }
      } catch (error) {
        toast.error("Failed to fetch post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user._id]);

  const handleLikeOrDislike = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const response = await axios.get(
        `http://localhost:3000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setLiked(!liked);
        setPostLike((prev) => (liked ? prev - 1 : prev + 1));

        // Update Redux store
        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPosts));

        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const handleAddComment = async () => {
    if (!text.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/post/${post._id}/comment`,
        { text },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        const newComment = response.data.comment;
        setPost((prev) => ({ ...prev, comments: [...prev.comments, newComment] }));

        // Update Redux store
        const updatedPosts = posts.map((p) =>
          p._id === post._id ? { ...p, comments: [...p.comments, newComment] } : p
        );
        dispatch(setPosts(updatedPosts));

        toast.success(response.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add comment.");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!post) return <p className="text-center">Post not found.</p>;

  return (
    <div className="flex justify-center items-center w-full md:ml-48 md:w-[70%] min-h-screen ">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-black">
          <img src={post.image} alt="post_img" className="w-full h-auto max-h-[600px] object-cover" />
        </div>

        {/* Right Side: Post Details */}
        <div className="w-full md:w-1/2 flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={post.author?.profilePicture} alt="profile" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="font-semibold">{post.author?.username}</h1>
            </div>
            <MoreHorizontal className="cursor-pointer" />
          </div>

          {/* Caption & Comments */}
          <div className="flex-1 overflow-y-auto p-4 max-h-60">
            <p className="text-sm">
              <span className="font-semibold">{post.author?.username}</span> {post.caption}
            </p>
            <div className="mt-3">
              {post.comments.length > 0 ? (
                post.comments.map((comment, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm py-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={comment.author?.profilePicture} alt="commenter" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p>
                      <span className="font-semibold">{comment.author?.username}</span> {comment.text}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="py-2 border-t">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                {liked ? (
                  <FaHeart size={"22px"} className="cursor-pointer text-red-500" onClick={handleLikeOrDislike} />
                ) : (
                  <FaRegHeart size={"22px"} className="cursor-pointer text-gray-600" onClick={handleLikeOrDislike} />
                )}
                <MessageCircle className="cursor-pointer hover:text-gray-600" onClick={() => setOpenComment(true)} />
                <Send className="cursor-pointer hover:text-gray-600" />
              </div>
              <Bookmark className="cursor-pointer hover:text-gray-600" />
            </div>
            <span className="font-medium block text-sm my-1 px-4">{postLike} likes</span>
          </div>

          {/* Add Comment */}
          <div className="flex items-center border-t py-2 px-4">
            <input
              type="text"
              placeholder="Add a comment..."
              className="outline-none text-sm flex-1 p-2"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button variant="ghost" className="text-blue-500 font-bold" onClick={handleAddComment}>
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
