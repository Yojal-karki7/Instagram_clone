
import { setMessages } from "@/store/chatSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store=>store.auth);
    
    useEffect(() => {
        const fetchAllMessage = async () => {
            console.log("Fetching messages for:", selectedUser._id);
            try {
                const res = await axios.get(`https://instagram-clone-backend-ivory.vercel.app/api/v1/message/all/${selectedUser?._id}`, { withCredentials: true, headers: {"Content-Type": "application/json"} });
                console.log("Response:", res.data); 
                if (res.data.success) {
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllMessage();
    }, [selectedUser]);
};
export default useGetAllMessage;