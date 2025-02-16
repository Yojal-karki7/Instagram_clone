import React, { useEffect, useState } from "react";
import axios from "axios";

const StoryViewer = ({ stories, onClose, currentUser }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!currentStory) return;

    // Mark story as viewed (only once per user)
    if (!currentStory.viewedBy.includes(currentUser._id)) {
      axios
        .post(
          `http://localhost:3000/api/v1/story/view/${currentStory._id}`,
          {}, // No body needed
          { withCredentials: true }
        )
        .then((res) => {
          console.log("Story viewed:", res.data);
          // Update viewedBy count locally
          setStories((prev) => {
            const updated = [...prev];
            updated[currentIndex] = {
              ...updated[currentIndex],
              viewedBy: [...updated[currentIndex].viewedBy, currentUser._id],
            };
            return updated;
          });
        })
        .catch((error) => console.error("Error marking story as viewed:", error));
    }

    // Auto-switch story after 5s
    const timer = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onClose();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, stories, onClose, currentUser]);

  if (!currentStory) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* Close Button */}
      <button className="absolute top-4 right-6 text-white text-3xl" onClick={onClose}>
        ✖
      </button>

      <div className="relative max-w-2xl w-full h-[90vh] flex flex-col items-center my-2">
        {/* Author Section */}
        <div className="absolute top-0 left-2 flex items-center space-x-3">
          <img
            src={currentStory.author?.profilePicture || "/default-avatar.jpg"}
            alt="Author"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <span className="text-white text-lg font-semibold">{currentStory.author?.username || "Unknown User"}</span>
        </div>

        {/* Story Content */}
        <div className="flex items-center justify-center w-full h-full">
          {currentStory.mediaType === "video" ? (
            <video src={currentStory.mediaUrl} autoPlay controls className="w-full h-auto max-h-[80vh] object-contain" />
          ) : (
            <img src={currentStory.mediaUrl} alt="Story" className="w-full h-auto max-h-[80vh] object-contain" />
          )}
        </div>

        {/* Navigation Buttons */}
        {currentIndex > 0 && (
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
            onClick={() => setCurrentIndex(currentIndex - 1)}
          >
            ◀
          </button>
        )}

        {currentIndex < stories.length - 1 && (
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
            onClick={() => setCurrentIndex(currentIndex + 1)}
          >
            ▶
          </button>
        )}

        {/* Viewed By Section */}
        <div className="absolute bottom-4 left-6 text-white text-sm">
          <p>👀 Viewed by {currentStory.viewedBy?.length || 0} people</p>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
