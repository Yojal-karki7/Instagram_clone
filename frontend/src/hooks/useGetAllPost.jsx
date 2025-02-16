import { setPosts } from "@/store/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllPost = async() => {
            try {
                const response = await axios.get("https://instagram-clone-backend-ivory.vercel.app/api/v1/post/all", {withCredentials:true});

                if(response.data.success) {
                    dispatch(setPosts(response.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPost()
    },[dispatch])
}

export default useGetAllPost;