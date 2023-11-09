import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageLoadingWheel from '../components/PageLoadingWheel'
import { StateContext } from '../StateContext'
import { COLORS } from '../styles/color'
import ProductCard from '../components/productCard'

const ProductsCategoryPage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageLoading, setPageLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const { category } = useParams()

  const { sidebarToggle } = useContext(StateContext)

  useEffect(() => {
    // Function to fetch products
    const fetchProducts = async () => {
      setIsLoading(true)
      setPageLoading(true)

      try {
        const { data } = await axios.get(
          `/products/category/${category}?page=${page}`
        )
        setTotalPages(data.totalPages)
        setProducts(data.products)
      } catch (err) {
        console.log('error : ' + err)
        setProducts([]) // Set products to an empty array or handle the error as needed
      } finally {
        setIsLoading(false)
        setPageLoading(false)
      }
    }

    fetchProducts()
  }, [category, page])

  useEffect(() => {
    const handleCategoryChange = () => {
      setPage(1)
    }

    handleCategoryChange()
  }, [category])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScroll = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      if (page < totalPages) {
        setPageLoading(true)
        setPage((prev) => prev + 1)
      }
    }
  }

  return (
    <div className="h-full w-full">
      {products.length > 0 ? (
        <div
          className={`p-4 grid w-full h-full grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-${
            sidebarToggle ? '3' : '4'
          } gap-4`}
          style={{ background: COLORS.CREAM }}
        >
          {products.length > 0 &&
            products.map((product) => (
              <ProductCard
                product={product}
                pageLoading={pageLoading}
                key={product._id}
              />
            ))}
        </div>
      ) : (
        <div className="flex h-[80vh] justify-center items-center">
          <p className=" w-full text-center mx-auto whitespace-nowrap flex justify-center items-center text-2xl font-semibold">
            Oops! No Products found!
          </p>
        </div>
      )}
      {pageLoading && page < totalPages && <PageLoadingWheel />}
      {page >= totalPages &&
        products.length > 0 &&
        !pageLoading &&
        !isLoading && (
          <div
            className="w-full h-44  flex items-center justify-center "
            style={{ background: COLORS.CREAM }}
          >
            <p className="text-center my-auto  w-full  text-gray-400 ">
              No more results!
            </p>
          </div>
        )}
    </div>
  )
}
export default ProductsCategoryPage
