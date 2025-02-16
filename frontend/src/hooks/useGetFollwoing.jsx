import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setFollowing } from "@/store/followingSlice";

const useFollowing = () => {
  const dispatch = useDispatch();
  const { following } = useSelector((store) => store.following);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/user/following", {
          withCredentials: true,
        });
        if (response.data.success) {
          dispatch(setFollowing(response.data.following)); // ✅ Update Redux store
        }
      } catch (error) {
        console.error("Error fetching following users:", error);
      }
    };

    fetchFollowingUsers();
  }, [dispatch]);

  return { following }; // ✅ Return following list for easy access
};

export default useFollowing;

