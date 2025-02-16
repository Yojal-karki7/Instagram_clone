import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StoryViewer from './StoryViewer';

const Stories = () => {
  const [stories, setStories] = useState([]);
  
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/v1/story/get', {withCredentials: true}); // Adjust API route if needed
        setStories(data.stories);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="flex space-x-2 p-4 overflow-x-auto scrollbar-hide">
      {stories.map((story) => (
        <div key={story._id} className="cursor-pointer" onClick={() => setSelectedStory(story)}>
          <img
            src={story.user.profilePicture}
            alt={story.user.username}
            className="w-16 h-16 rounded-full border-2 border-red-500"
          />
          
        </div>
      ))}
      {selectedStory && <StoryViewer story={selectedStory} onClose={() => setSelectedStory(null)} />}
    </div>
  );
};

export default Stories;
