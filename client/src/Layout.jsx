import { Outlet } from 'react-router-dom'

import Sidebar from './components/Sidebar.jsx'
import { StateContext } from './StateContext.jsx'
import { useContext } from 'react'
import Navbar from './components/Navbar.jsx'

const Layout = () => {
  const { sidebarToggle } = useContext(StateContext)

  return (
    <div
      className={`mt-36 max-lg:ml-auto ml-${
        sidebarToggle ? '52' : '0'
      }  sm:mt-24 transition-all ease-in-out `}
    >
      <Navbar />
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default Layout
