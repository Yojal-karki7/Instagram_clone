import React from 'react'
import Posts from './Posts'
import Stories from './Stories'

const Feed = () => {
  return (
    <div className='w-full  flex flex-col items-center pl-0 sm:pl-[20%]'>
        {/* <Stories /> */}
        <Posts />
    </div>
  )
}

export default Feed