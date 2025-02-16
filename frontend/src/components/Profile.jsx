import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { addFollowing, removeFollowing } from "@/store/follwoingSlice";
import { setUserProfile } from "@/store/authSlice";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const dispatch = useDispatch();
  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;

  // State for follow/unfollow
  const [followersCount, setFollowersCount] = useState(userProfile?.followers?.length || 0);
  const [isFollowing, setIsFollowing] = useState(userProfile?.followers?.includes(user?._id));
  
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (userProfile) {
      setFollowersCount(userProfile.followers.length);
      setIsFollowing(userProfile.followers.includes(user?._id));
    }
  }, [userProfile, user]);

  const followOrUnfollowUser = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/user/followorunfollow/${userId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedFollowers = isFollowing
        ? userProfile.followers.filter((id) => id !== user?._id) // Unfollow: Remove user from followers
        : [...userProfile.followers, user?._id]; // Follow: Add user to followers

      dispatch(setUserProfile({ ...userProfile, followers: updatedFollowers })); 
        const newFollowingStatus = res.data.isFollowing; // Get actual status from backend
        setIsFollowing(newFollowingStatus);
        setFollowersCount(res.data.followersCount);

        toast.success(res.data.message);

        // ✅ Update Redux Store correctly
        if (newFollowingStatus) {
          dispatch(addFollowing({ _id: userId, username: userProfile.username, profilePicture: userProfile.profilePicture }));
        } else {
          dispatch(removeFollowing(userId));
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost = activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex max-w-5xl justify-center mx-auto sm:pl-10">
      <div className="flex flex-col gap-20 sm:pl-48 py-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center pl-10">
            <Avatar className="w-36 h-36">
              <AvatarImage src={userProfile?.profilePicture} alt="profile picture" className="object-cover" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section className="pr-4">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <Link to={"/account/edit"}>
                    <Button className="hover:bg-gray-200 h-8" variant="secondary">
                      Edit Profile
                    </Button>
                  </Link>
                ) : isFollowing ? (
                  <>
                    <Button onClick={followOrUnfollowUser} variant="secondary" className="h-8">
                      Unfollow
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button onClick={followOrUnfollowUser} className="bg-[#0096F6] hover:bg-[#3192d2] h-8 text-white">
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">{userProfile?.posts?.length} </span>posts
                </p>
                <p>
                  <span className="font-semibold">{followersCount} </span>followers
                </p>
                <p>
                  <span className="font-semibold">{userProfile?.following?.length} </span>following
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-semibold">{userProfile?.bio || "Bio here..."}</span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              onClick={() => handleActiveTab("posts")}
              className={`py-3 cursor-pointer ${activeTab === "posts" ? "font-bold border-t border-black" : ""}`}
            >
              Posts
            </span>
            <span
              onClick={() => handleActiveTab("saved")}
              className={`py-3 cursor-pointer ${activeTab === "saved" ? "font-bold border-t border-black" : ""}`}
            >
              Saved
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 pl-4 pr-4">
            {displayedPost?.map((post) => (
              <div className="relative group cursor-pointer" key={post?._id}>
                <img src={post.image} alt="post_img" className="rounded-sm my-2 w-[100%] aspect-square object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span>{post?.likes?.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span>{post?.comments?.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
