import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataUrl } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';

const CreatePost = ({openCreatePost, setOpenCreatePost}) => {
  const imageRef = useRef();
  const [file, setFile] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store => store.auth);
  const dispatch = useDispatch()


  const handleFileChange = async(e) => {
    const file = e.target.files?.[0];
    if(file) {
      setFile(file);
      const dataUrl = await readFileAsDataUrl(file);
      setImagePreview(dataUrl)
    }
  }

  const handleCreateStory = async(e) => {
    const formData = new FormData();
    if (imagePreview) formData.append("media", file)
    
    try {
      setLoading(true)
      const response = await axios.post('http://localhost:3000/api/v1/story/add', formData, {withCredentials: true, headers: {"Content-Type":'multipart/form-data'}});
      if(response.data.success) {
        toast.success(response.data.message);
        setOpenCreatePost(false)
      }
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false)
    }
  }

  
  return (
    <Dialog open={openCreatePost}>
      <DialogContent onInteractOutside={()=>setOpenCreatePost(false)}>
        <DialogHeader className='text-center font-semibold'>
          Create New Story
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img"/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="">
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='text-gray-600 text-xs'>{user?.bio}</span>
          </div>
        </div>
        {
          imagePreview && (
            <div className="flex items-center justify-center w-full h-64">
              <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md'/>
            </div>
          )
        }
        <input type="file" className='hidden' ref={imageRef} onChange={handleFileChange}/>
        <Button onClick={()=>imageRef.current.click()} className='w-fit mx-auto bg-[#0095f6] hover:bg-[#258bcf] '>Select from computer</Button>
        {
          imagePreview && (
            loading ? (
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                please wait
              </Button>
            ) : (
              <Button onClick={handleCreateStory} type='submit' className='w-full'>Create</Button>
            )
          )
        }
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost