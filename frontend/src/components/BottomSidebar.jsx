import {
    Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/store/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/store/postSlice";

const BottomSidebar = () => {
    const navigate = useNavigate()
    const {user} = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [openCreatePost, setOpenCreatePost] = useState(false)

    
    const handleSidebar = (type) => {
        if(type === 'Home') {
          navigate('/')
        }
        else if(type === 'Create') {
          setOpenCreatePost(true);
        }
        else if(type === 'Messages') {
          navigate('/chat')
        }
        else if(type === 'Profile') {
          navigate(`/profile/${user?._id}`)
        }
    }
    const sidebarItems = [
      {
        icon: <Home />,
        text: "Home",
      },
      {
        icon: <TrendingUp />,
        text: "Explore",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
      {
        icon: <MessageCircle />,
        text: "Messages",
      },
      {
        icon: (
          <Avatar className='w-8 h-8'>
            <AvatarImage src={user?.profilePicture} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ),
        text: "Profile",
      },
    ];
  return (
    <div className="fixed border-t border-gray-300 flex justify-between items-center sm:hidden md:w-[18%]">
      <div className="">
        <div className="w-full px-2 bg-white justify-between flex  items-center bottom-0 fixed h-[60px]">
          {sidebarItems.map((item, index) => {
            return (
              <ul onClick={() => handleSidebar(item.text)} className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3" key={index}>
                {item.icon}
              </ul>
            );
          })}
        </div>
      </div>
      <CreatePost openCreatePost={openCreatePost} setOpenCreatePost={setOpenCreatePost} />
    </div>
  )
}

export default BottomSidebar