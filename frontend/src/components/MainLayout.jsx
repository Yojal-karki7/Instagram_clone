import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import BottomSidebar from './BottomSidebar'

const MainLayout = () => {
  return (
    <div>
      <LeftSidebar />
      <BottomSidebar />
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
