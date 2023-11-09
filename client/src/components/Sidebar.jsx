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
    <>
      <div
        className={`fixed  ${
          sidebarToggle ? 'block' : 'hidden'
        } z-10 top-0 w-full  lg:hidden left-0 bottom-0 max-lg:bg-black/70  transition-all ease-in-out`}
        onClick={() => {
          setSidebarToggle(!sidebarToggle)
        }}
      ></div>
      <div
        className={`fixed border-r z-0 max-lg:z-10 cursor-pointer  top-32 left-0 bg-slate-100 sm:top-20  bottom-0 gap-y-1 w-52 flex flex-col   py-4 ${
          sidebarToggle ? 'translate-x-0' : '-translate-x-52'
        } transition-all ease-in-out overflow-hidden px-2`}
        style={{ background: COLORS.WHITE }}
      >
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
    </>
  )
}
export default Sidebar
