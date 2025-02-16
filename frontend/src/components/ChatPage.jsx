import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/store/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircle, X } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/store/chatSlice";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const dispatch = useDispatch();
  const { user, selectedUser, userProfile } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const [followingUsers, setFollowingUsers] = useState(user?.following || userProfile?.following);

  // Ref for scrolling
  const messagesEndRef = useRef(null);

  const handleSendMessage = async (receiverId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/message/send/${receiverId}`,
        { textMessage },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        dispatch(setMessages([...messages, response.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollowingUsers = async () => {
    try {
      const response = await axios.get('https://instagram-clone-backend-ivory.vercel.app/api/v1/user/following', { withCredentials: true });
      if (response.data.success) {
        setFollowingUsers(response.data.following);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFollowingUsers();
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  // Scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex sm:ml-[20%] h-screen">
      {/* Sidebar */}
      <section className={`w-full md:w-1/4 py-8 mb-8 ${selectedUser ? "hidden" : "block w-[80px]"} h-[100vh] border-r`}>
        <h1 className="font-bold mb-4 px-3 text-xl hidden sm:block">{user?.username}</h1>
        <hr className="border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {followingUsers.length > 0 ? (
            followingUsers.map((followingUser) => {
              const isOnline = onlineUsers.includes(followingUser?._id);
              return (
                <div
                  key={followingUser?._id}
                  onClick={() => dispatch(setSelectedUser(followingUser))}
                  className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={followingUser?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium hidden sm:block">{followingUser?.username}</span>
                    <span className={`text-xs font-bold hidden sm:block ${isOnline ? "text-green-600" : "text-red-600"}`}>
                      {isOnline ? "online" : "offline"}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 mt-4">You are not following anyone yet.</p>
          )}
        </div>
      </section>

      {/* Chat Window */}
      {selectedUser ? (
        <section className="flex-1 flex flex-col h-[95vh] sm:h-full mb-3">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt="profilePicture" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex items-center w-full justify-between">
              <span>{selectedUser?.username}</span>
              <Button onClick={() => dispatch(setSelectedUser(null))} variant="secondary">
                <X size={24} />
              </Button>
            </div>
          </div>
          <Messages selectedUser={selectedUser} messagesEndRef={messagesEndRef} />
          <div className="flex items-center p-4">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Enter a message"
            />
            <Button onClick={() => handleSendMessage(selectedUser?._id)}>Send</Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto pl-2">
          <MessageCircle className="w-32 h-32 my-4" />
          <h1 className="font-medium text-left">Your Messages</h1>
          <span>Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
