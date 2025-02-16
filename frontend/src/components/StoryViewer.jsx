import React, { useEffect, useState } from 'react';

const StoryViewer = ({ story, onClose }) => {
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    if (story.mediaType === 'video') {
      setIsVideo(true);
    } else {
      setIsVideo(false);
    }

    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [story, onClose]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50">
      <button className="absolute top-4 right-4 text-white text-2xl" onClick={onClose}>✖</button>
      <div className="max-w-md w-full">
        {isVideo ? (
          <video src={story.mediaUrl} autoPlay controls className="w-full h-auto" />
        ) : (
          <img src={story.mediaUrl} alt="Story" className="w-full h-auto" />
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
