import { Link, useLocation, useNavigate } from 'react-router-dom'
import SidebarTab from './SidebarTab'
import { COLORS } from '../styles/color'
import { setSidebarToggle } from '../slices/sidebarSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import LogoutModal from './modals/logoutModal'

const Sidebar = () => {
  const location = useLocation()
  const page = location.pathname.split('/')[2]

  const navigate = useNavigate()

  const dispatch = useDispatch()
  const sidebarToggle = useSelector((state) => state.sidebar.sidebarToggle)
  const user = useSelector((state) => state.user.user)
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)

  const [logoutModal, setLogoutModal] = useState(false)

  return (
    <div className="z-[31] ">
      <div
        className={`fixed z-[31]  ${
          sidebarToggle ? 'block bg-black/50  ' : 'hidden bg-black/10  '
        } z-10 top-0 w-full   left-0 bottom-0 transition-all ease-in-out `}
        onClick={() => {
          dispatch(setSidebarToggle())
        }}
      >
        <img
          src="../../assets/icons/modal-close.png"
          alt="sidebar-close"
          className="fixed left-52 ml-3  scale-105 top-5 cursor-pointer"
        />
      </div>
      <div
        className={`fixed z-[31] border-r rounded-lg cursor-pointer  top-0 left-0 bg-white  bottom-0 gap-y-1 w-52 flex flex-col   py-4 ${
          sidebarToggle ? 'translate-x-0' : '-translate-x-52'
        } transition-all ease-in-out overflow-hidden px-2`}
        style={{ background: COLORS.WHITE }}
      >
        <div
          className="flex text-xl w-full rounded-md text-violet-600 font-medium gap-x-2 px-3 h-16 items-center transition-all duration-300 hover:scale-100 active:scale-95 mb-6"
          onClick={() => {
            !isLoggedIn && navigate('/login')
          }}
        >
          Hello,{' '}
          <p className="font-bold">{isLoggedIn ? user.name : 'Sign In'}</p>
        </div>
        <SidebarTab name="Home" toLink="/" page={page} />
        <SidebarTab
          name="smartphone"
          toLink="/products/smartphone"
          page={page}
        />
        <SidebarTab name="tab" toLink="/products/tab" page={page} />
        <SidebarTab name="laptop" toLink="/products/laptop" page={page} />
        <SidebarTab
          name="smartwatch"
          toLink="/products/smartwatch"
          page={page}
        />
        <button
          className="mt-auto mb- text-lg w-full h-12  rounded-lg border   hover:bg-red-500 hover:text-white font-semibold text-red-600 transition-all ease-in-out"
          onClick={() => setLogoutModal(true)}
        >
          logout
        </button>
      </div>
      {logoutModal && <LogoutModal setLogoutModal={setLogoutModal} />}
    </div>
  )
}
export default Sidebar
