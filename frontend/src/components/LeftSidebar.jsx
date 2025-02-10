import {
    Heart,
    HeartPulse,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const sidebarItems = [
  {
    icon: <Home />,
    text: "Home",
  },
  {
    icon: <Search />,
    text: "Search",
  },
  {
    icon: <TrendingUp />,
    text: "Explore",
  },
  {
    icon: <MessageCircle />,
    text: "Messages",
  },
  {
    icon: <Heart/>,
    text: "Notifications",
  },
  {
    icon: <MessageCircle />,
    text: "Messages",
  },
  {
    icon: <PlusSquare />,
    text: "Create",
  },
  {
    icon: (
      <Avatar className='w-8 h-8'>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    text: "Profile",
  },
  {
    icon: <LogOut />,
    text: "Logout",
  },
];

const LeftSidebar = () => {
    const navigate = useNavigate()
    const handleLogout = async() => {
        try {
            const res = await axios.get('http://localhost:3000/api/v1/user/logout', {withCredentials: true});
            if(res.data.success) {
                navigate('/login')
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }
    const handleSidebar = (type) => {
        if(type === 'Logout') {
            handleLogout();
        }
    }
  return (
    <div className="fixed top-8 z-10 left-0 px-4 border-r border-gray-300 w-[18%] h-screen">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">LOGO</h1>
        <div className="">
          {sidebarItems.map((item, index) => {
            return (
              <div onClick={() => handleSidebar(item.text)} className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3" key={index}>
                {item.icon}
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
