import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessages";
import useGetRTM from "@/hooks/useRTM";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  // Scroll reference
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      {/* User Info Section */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="mt-2 font-medium">{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat Messages Section */}
      <div className="flex flex-col gap-3 mt-4">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              className={`flex ${
                msg.senderId === user?._id ? "justify-end" : "justify-start"
              }`}
              key={msg._id}
            >
              <div
                className={`p-3 rounded-lg max-w-xs break-words text-sm ${
                  msg.senderId === user?._id
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-black self-start"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No messages yet</p> // Show placeholder if no messages
        )}
        {/* Scroll to bottom element */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
