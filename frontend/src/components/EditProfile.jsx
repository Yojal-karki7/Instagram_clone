import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setAuthUser } from "@/store/authSlice";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    profilePhoto:user?.profilePicture,
    bio:user?.bio,
    gender:user?.gender
  })
  const imgRef = useRef();

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if(file) {
        setInput({...input, profilePhoto:file})
    }
}

  const handleEditProfile = async() => {
    console.log(input);
    const formData = new FormData();
    formData.append("bio", input.bio)
    formData.append('gender', input.gender)
    if(input.profilePhoto) {
        formData.append("profilePhoto", input.profilePhoto)
    }
    try {
        setLoading(true)
        const response = await axios.post('http://localhost:3000/api/v1/user/profile/edit', formData, {withCredentials:true, headers:{"Content-Type":'multipart/form-data'}});
        if(response.data.success) {
            const updatedUserData = {
                ...user,
                bio:response.data.user?.bio,
                profilePicture:response.data.user?.profilePicture,
                gender:response.data.user?.gender,
            }
            toast.success(response.data.message);
            navigate(`/profile/${user?._id}`);
            dispatch(setAuthUser(updatedUserData))
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
    } finally {
        setLoading(false);
    }
}

const selectChangeHandler = (value) => {
    setInput({...input, gender:value})
}

  return (
    <div className="flex max-w-xl mx-auto p-4 pl-30">
      <section className="flex flex-col gap-4 w-full">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage className='object-cover' src={user?.profilePicture}alt="post_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="">
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input ref={imgRef} onChange={handleChange} type="file" className="hidden" />
          <Button
            onClick={() => imgRef.current.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#3996d4]"
          >
            Change Photo
          </Button>
        </div>
        <div className="">
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
            name="bio"
            value={input.bio}
            onChange={(e) => setInput({...input, bio:e.target.value})}
            className="focus-visible:ring-transparent"
            placeholder="Add your bio here..."
          />
        </div>
        <div className="">
          <h1 className="font-bold mb-2">Gender</h1>
          <Select defaultValue={input?.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className=" w-full">
              <SelectValue placeholder='Select your gender'/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
            {
                loading ? (
                    <Button className='w-fit bg-[#0095F6] hover:bg-[#3996d4]'>
                        <Loader2 className="mr-1 h-4 w-4 animate-spin"/>
                        Please wait
                    </Button>
                ) : (
                    <Button onClick={handleEditProfile} className='w-fit bg-[#0095F6] hover:bg-[#3996d4]'>Submit</Button>
                )
            }
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
