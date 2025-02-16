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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { clearNotifications } from "@/store/rtnSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  ) || [];
  const messageNotification = useSelector(
    (state) => state.realTimeNotification.messageNotification.filter(noti => noti.type) // ✅ Filter out non-message objects
  ) || [];
  console.log("Like Notifications:", JSON.stringify(likeNotification, null, 2));
  console.log(
    "Message Notifications:",
    JSON.stringify(messageNotification, null, 2)
  );

  const dispatch = useDispatch();
  const [openCreatePost, setOpenCreatePost] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const handleSidebar = (type) => {
    if (type === "Logout") {
      handleLogout();
    } else if (type === "Create") {
      setOpenCreatePost(true);
    } else if (type === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (type === "Home") {
      navigate(`/`);
    } else if (type === "Messages") {
      navigate("/chat");
    }
  };
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
      icon: <Heart />,
      text: "Notifications",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
    {
      icon: (
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={user?.profilePicture}
            alt="@shadcn"
            className="object-cover"
          />
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
  const handleClearNotifications = () => {
    dispatch(clearNotifications());
  };
  return (
    <div className="fixed px-4 top-0 z-10 left-0 border-r border-gray-300 hidden sm:block md:w-[20%] h-screen">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold my-6 pl-3">LOGO</h1>
        <div className="">
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => handleSidebar(item.text)}
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
                key={index}
              >
                {item.icon}
                <span>{item.text}</span>
                {item.text === "Notifications" && likeNotification?.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                        >
                          {likeNotification.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          <button
                            onClick={handleClearNotifications}
                            className="p-2 bg-red-500 text-white rounded w-full text-center mb-2"
                          >
                            Clear Notifications
                          </button>
                        </div>
                        <div>
                          {likeNotification.length === 0 ? (
                            <p>No new notification</p>
                          ) : (
                            likeNotification.map((notification) => {
                              return (
                                <div
                                  key={notification.userId}
                                  className="flex items-center gap-2 my-2"
                                >
                                  <Avatar>
                                    <AvatarImage
                                      src={
                                        notification.userDetails?.profilePicture
                                      }
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm">
                                    <span className="font-bold">
                                      {notification.userDetails?.username}
                                    </span>{" "}
                                    liked your post
                                  </p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                {item.text === "Messages" &&
                  messageNotification?.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full h-5 w-5 bg-blue-600 hover:bg-blue-600 absolute bottom-6 left-6"
                        >
                          {messageNotification.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          {messageNotification.length === 0 ? (
                            <p>No new messages</p>
                          ) : (
                            messageNotification?.map((notification) => (
                              <div
                                key={notification.userId}
                                className="flex items-center gap-2 my-2"
                              >
                                <Avatar>
                                  <AvatarImage
                                    src={
                                      notification.userDetails?.profilePicture
                                    }
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                  <span className="font-bold">
                                    {notification.userDetails?.username}
                                  </span>
                                  :{" "}
                                  {notification.text.length > 20
                                    ? notification.text.slice(0, 20) + "..."
                                    : notification.text}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost
        openCreatePost={openCreatePost}
        setOpenCreatePost={setOpenCreatePost}
      />
    </div>
  );
};

export default LeftSidebar;
