import { Link, useParams } from 'react-router-dom'
import { StateContext } from '../StateContext'
import { useContext } from 'react'
import { COLORS } from '../styles/color'
import { motion } from 'framer-motion'

const SidebarTab = ({ name, toLink, page }) => {
  const { sidebarToggle, setSidebarToggle } = useContext(StateContext)

  const { category } = useParams()

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.1 },
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setSidebarToggle(!sidebarToggle)
      }}
      style={{ background: COLORS.CREAM }}
    >
      <Link
        to={toLink}
        className={`flex justify-start items-center w-full   h-14 text-lg ${
          name === category ? 'bg-violet-900 text-white' : ''
        }  hover:shadow-md pl-5 ${name !== category && 'hover:bg-violet-300'}
        font-semibold  border-b capitalize`}
      >
        {name}
      </Link>
    </motion.div>
  )
}
export default SidebarTab
