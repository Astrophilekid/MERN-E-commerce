import { useContext, useEffect, useState } from 'react'
import { COLORS } from '../styles/color'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import { StateContext } from '../StateContext'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import axios from 'axios'

const Navbar = () => {
  const [productList, setProductList] = useState([])
  const [hasSearched, setHasSearched] = useState(false)

  const {
    sidebarToggle,
    setSidebarToggle,
    setSearchResults,
    search,
    setSearch,
  } = useContext(StateContext)

  useEffect(() => {
    setHasSearched(false)
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `/products/search-term/?searchTerm=${search}`
        )
        // console.log(response.data.suggestions)
        setProductList(response.data.suggestions)
      } catch (error) {
        console.error('Could not fetch products:', error)
      }
    }

    if (search) {
      fetchProducts()
    }
  }, [search])

  const searchProduct = async () => {
    try {
      const { data } = await axios.get(
        `/products/searchProduct?productName=${search}`
      )

      if (data.success) {
        setSearchResults(data.product)
        setHasSearched(true)
        // console.log(data.product)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      return { error: error.message }
    }
  }

  return (
    <div className="max-sm:mb-10">
      <nav
        className="absolute top-0 left-0 overflow-hidden right-0 h-32  sm:h-20 transition-all ease-in-out  flex  flex-col gap-y-2 pb-2 z-30 overflow-x-hidden"
        style={{ background: COLORS.BACKGROUND }}
      >
        <div className="flex my-auto relative items-center justify-between px-2 md:px-8 sm:px-5 gap-x-5 lg:gap-x-10">
          {/* left */}
          <div className=" min-w-fit">
            <div className="flex gap-x-6 ml-3 sm:gap-x-10   items-center">
              <motion.img
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.1 },
                }}
                whileTap={{ scale: 0.95 }}
                src="/hamburger.png"
                className="h-8 mr-2 "
                alt="hamburger"
                onClick={() => {
                  setSidebarToggle(!sidebarToggle)
                  // console.log(sidebarToggle)
                }}
              />
              <Link to="/" className="-ml-8">
                <motion.img
                  whileTap={{ scale: 0.95 }}
                  src="/logo_nav.png"
                  className="h-20 max-md:hidden max-sm:ml-5 max-sm:scale-90 transition lg:inline ease-in-out"
                  alt="Gadget Bazaar logo"
                />
                <motion.img
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.9 }}
                  src="/icon.png"
                  className="h-16 transition md:hidden "
                  alt="Gadget Bazaar mobile logo"
                />
              </Link>
            </div>
          </div>

          {/* middle */}
          <div className=" w-3/4 min-w-[30%]   max-w-[800px] ]  hidden sm:flex flex-col mt-3">
            <div className="flex items-center   focus:border-2 rounded-md  justify-center  ">
              <input
                type="text"
                value={search}
                className="placeholder:text-base "
                placeholder="Search here..."
                onChange={(e) => setSearch(e.target.value)}
              />
              <div
                className="h-10 -ml-1   flex w-16 justify-center items-center  z-[1] search__div"
                onClick={searchProduct}
                style={{ background: COLORS.GRADIENT, color: 'white' }}
              >
                <motion.img
                  whileHover={{
                    scale: 1.0,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  src="../../assets/icons/search.png"
                  alt="search"
                  className="w-7 cursor-pointer"
                />
              </div>
            </div>
            {search.length > 0 && !hasSearched && (
              <div className="relative w-full " style={{ zIndex: '100' }}>
                <div className="fixed cursor-pointer top-16 z-50 sm:w-2/6 md:w-2/5 border shadow-md bg-purple-100 p-1 h-fit rounded-lg ">
                  {productList.length > 0 ? (
                    productList.map((value, i) => (
                      <p
                        key={i}
                        onClick={() => {
                          setSearch(value.name)
                        }}
                        className=" p-1 border-b rounded-lg hover:bg-purple-300 hover:font-medium  my-1 "
                      >
                        {value.name}
                      </p>
                    ))
                  ) : (
                    <p className=" p-1 border-b rounded-lg  font-medium italic hover:font-medium my-1 ">
                      {`Search for "${search}"`}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* right */}
          <div className=" flex items-center">
            <div className="flex justify-between gap-x-4 sm:gap-x-8   items-center">
              <Link to={'/'} className="whitespace-nowrap text-white ">
                <p className="text-xs leading-none">
                  Hello, {true ? 'Ajesh s' : 'sign in'}
                </p>
                <p className="text-xl font-semibold">Account</p>
              </Link>

              <div className="-mb-3 ">
                <h1 className="text-xl font-semibold text-white ">Orders</h1>
              </div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.1 },
                }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2"
              >
                <p className="absolute top-0 right-2 text-xs bg-red-400 text-white font-bold rounded-full px-[5px]">
                  {' 1'}
                </p>
                <img
                  src="./cart.png"
                  className="w-10 min-w-[25px] sm:min-w-[35px]"
                  alt="cart"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* mobile search */}
        <div className="sm:hidden transition-all ease-in-out px-4 w-full flex ">
          <div className="flex flex-col  items-center  rounded-md w-full  h-11 ">
            <div className="w-full flex items-center   h-full">
              <input
                type="text"
                className=".search__input h-full focus:border-2 focus:border-red-400 placeholder:text-base"
                placeholder="Search here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div
                className="h-full px-2 flex search__div items-center -ml-1 search__div"
                style={{ background: COLORS.GRADIENT, color: 'white' }}
              >
                <motion.img
                  whileHover={{
                    scale: 1,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.9 }}
                  src="../../assets/icons/search.png"
                  alt="search"
                  className="w-7 cursor-pointer"
                />
              </div>
            </div>
            {search.length > 0 && !hasSearched && (
              <div className="relative w-full " style={{ zIndex: '100' }}>
                <div className="fixed cursor-pointer  mt-1 w-5/6 shadow-md bg-purple-100 p-1 h-fit rounded-lg ">
                  {productList.length > 0 ? (
                    productList.map((value, i) => (
                      <p
                        key={i}
                        onClick={() => {
                          setSearch(value.name)
                          searchProduct()
                        }}
                        className=" p-1 border-b rounded-lg hover:bg-purple-300 hover:font-medium  my-1 "
                      >
                        {value.name}
                      </p>
                    ))
                  ) : (
                    <div
                      className=" p-1 border-b rounded-lg flex   italic  my-1 "
                      onClick={() => {
                        setSearch(search)
                        searchProduct()
                      }}
                    >
                      Search for&nbsp;
                      <p className="font-medium">{`"${search}"`}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}
export default Navbar
