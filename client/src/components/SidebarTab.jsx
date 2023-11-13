import { Link, useParams } from 'react-router-dom'
import { COLORS } from '../styles/color'
import { motion } from 'framer-motion'
import { setSidebarToggle } from '../slices/sidebarSlice.js'
import { useDispatch } from 'react-redux'

const SidebarTab = ({ name, toLink, page }) => {
  const dispatch = useDispatch()

  const { category } = useParams()

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.1 },
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        dispatch(setSidebarToggle())
      }}
      style={{ background: COLORS.CREAM }}
    >
      <Link
        to={toLink}
        className={`flex justify-start  items-center w-full   h-14 text-lg

        ${
          name === category || (category === undefined && name === 'Home')
            ? 'bg-violet-900 text-white'
            : ''
        }  hover:shadow-md pl-5 ${
          name !== category &&
          !(category === undefined && name === 'Home') &&
          'hover:bg-violet-300'
        }
        font-semibold  border-b capitalize`}
      >
        {name}
      </Link>
    </motion.div>
  )
}
export default SidebarTab
