import { Link, useLocation } from 'react-router-dom'
import SidebarTab from './SidebarTab'
import { StateContext } from '../StateContext'
import { useContext } from 'react'
import { COLORS } from '../styles/color'

const Sidebar = () => {
  const location = useLocation()
  const page = location.pathname.split('/')[2]

  const { sidebarToggle, setSidebarToggle } = useContext(StateContext)

  return (
    <div className="z-[31]">
      <div
        className={`fixed z-[31]  ${
          sidebarToggle ? 'block' : 'hidden'
        } z-10 top-0 w-full   left-0 bottom-0 bg-black/70  transition-all ease-in-out`}
        onClick={() => {
          setSidebarToggle(!sidebarToggle)
        }}
      >
        <img
          src="./modal-close.png"
          alt="sidebar-close"
          className="fixed left-52 ml-3  scale-105 top-5 cursor-pointer"
        />
      </div>
      <div
        className={`fixed z-[31] border-r  cursor-pointer  top-0 left-0 bg-slate-100   bottom-0 gap-y-1 w-52 flex flex-col   py-4 ${
          sidebarToggle ? 'translate-x-0' : '-translate-x-52'
        } transition-all ease-in-out overflow-hidden px-2`}
        style={{ background: COLORS.WHITE }}
      >
        <div className="flex text-xl w-full rounded-md bg-purple-800 text-white font-medium gap-x-2 px-3 h-16 items-center transition-transform duration-300 hover:scale-105 active:scale-95">
          Hello, <p className="font-bold">{'Ajesh S'}</p>
        </div>
        <SidebarTab name="All" toLink="/" page={page} />
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
      </div>
    </div>
  )
}
export default Sidebar
