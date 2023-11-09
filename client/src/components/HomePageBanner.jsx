import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { images } from '../../constants/images'

const HomePageBanner = () => {
  const [selected, setSelected] = useState(0)
  const transition = { type: 'spring', duration: 3 }

  useEffect(() => {
    const timer = setInterval(() => {
      setSelected((selected + 1) % images.length)
    }, 3000)
    return () => clearInterval(timer) // Clean up on unmount
  }, [selected, images.length])
  return (
    <div className="hidden w-screen bg-white max-h-96 min-h-fit relative md:block xl:mb-20">
      <motion.img
        key={selected}
        initial={{ opacity: 0.1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.1 }}
        transition={transition}
        src={images[selected]}
        alt="banner"
        className="object-cover w-full"
      />
    </div>
  )
}
export default HomePageBanner
