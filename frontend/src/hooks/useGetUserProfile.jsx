import { setSuggestedUser, setUserProfile } from "@/store/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchUserProfile = async() => {
            try {
            const response = await axios.get(`http://localhost:3000/api/v1/user/${userId}/profile`, {withCredentials:true});
                if(response.data.success) {
                    dispatch(setUserProfile(response.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    },[userId])
}

export default useGetUserProfile;