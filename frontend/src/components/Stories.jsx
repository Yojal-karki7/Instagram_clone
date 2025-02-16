import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import StoryViewer from "./StoryViewer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import CreatePost from "./createStory";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [selectedUserStories, setSelectedUserStories] = useState([]);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Store logged-in user
  const [currentUserStories, setCurrentUserStories] = useState([]); // Store the logged-in user's stories
  const {user} = useSelector(store => store.auth);
  const inputRef = useRef();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/v1/story/get", {
          withCredentials: true,
        });

        console.log("Fetched Stories:", data);

        setCurrentUser(data.currentUser); // Store the logged-in user

        // Group stories by author._id
        const groupedStories = data.stories.reduce((acc, story) => {
          const authorId = story.author?._id;
          if (!acc[authorId]) {
            acc[authorId] = { author: story.author, stories: [] };
          }
          acc[authorId].stories.push(story);
          return acc;
        }, {});

        // Convert object to array
        const formattedStories = Object.values(groupedStories);

        // Check if current user has any stories
        const userStories = formattedStories.find(
          (user) => user.author._id === data.currentUser?._id
        );
        setCurrentUserStories(userStories ? userStories.stories : []);

        setStories(formattedStories);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

  const handleAddStory = async() => {
    try {
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex w-full sm:pl-36 space-x-3 py-2 px-2 overflow-x-auto scrollbar-hide">
      {/* Add Story (Always First) */}
            <div className="relative h-1/6">
            <img className='w-16 h-16 rounded-full object-cover' src={user?.profilePicture} alt='profile_img'/>
            <input type="file" hidden ref={inputRef}/>
            <Button onClick={()=>setOpenCreatePost(true)} className='absolute bottom-0 right-2 h-2 w-2 rounded-full bg-blue-500'>
              <Plus />
            </Button>
          </div>
      {/* Display Stories from Followed Users */}
      {stories.length === 0 ? (
        <p className="text-gray-400">No Stories to display!</p>
      ) : (
        stories.map((userStories) =>
          userStories.author._id !== currentUser?._id ? ( // Exclude current user (since they're already first)
            <div
              key={userStories.author._id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setSelectedUserStories(userStories.stories)}
            >
              <img
                src={userStories.author?.profilePicture || "/default-avatar.jpg"}
                alt={userStories.author?.username || "Unknown User"}
                className="w-16 h-16 rounded-full border-2 border-red-500 object-cover"

              />
              <p className="text-xs text-white">{userStories.author.username}</p>
            </div>
          ) : null
        )
      )}
      <CreatePost openCreatePost={openCreatePost}
        setOpenCreatePost={setOpenCreatePost}/>

      {/* Story Viewer */}
      {selectedUserStories.length > 0 && (
        <StoryViewer stories={selectedUserStories} onClose={() => setSelectedUserStories([])} currentUser={user}/>
      )}
    </div>
  );
};

export default Stories;
