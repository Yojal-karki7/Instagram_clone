import { setSuggestedUser } from "@/store/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchSuggestedUsers = async() => {
            try {
            const response = await axios.get('https://instagram-clone-backend-ivory.vercel.app/api/v1/user/suggested', {withCredentials:true});
                if(response.data.success) {
                    dispatch(setSuggestedUser(response.data.suggestedUsers));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestedUsers();
    },[dispatch])
}

export default useGetSuggestedUsers;