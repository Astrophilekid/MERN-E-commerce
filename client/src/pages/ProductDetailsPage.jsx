import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { COLORS } from '../styles/color'
import axios from 'axios'
import { Rate } from 'antd'
import ProductDetailsSkelton from '../components/skeltons/ProductDetailsSkelton'

const ProductDetailsPage = () => {
  const [product, setProduct] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [index, setIndex] = useState(0)
  const [rating, setRating] = useState(0)
  const { id } = useParams()

  useEffect(() => {
    setIsLoading(true)
    axios.get(`/products/${id}`).then(({ data }) => {
      setProduct(data.product)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    })
  }, [])

  const {
    _id,
    name,
    category,
    brand,
    description,
    discount,
    price,
    images = [],
    stock,
    numOfReviews,
    avgRating,
    reviews = [],
  } = product

  return (
    <>
      {isLoading ? (
        <ProductDetailsSkelton />
      ) : (
        <div className="flex flex-col max-sm:px-2 justify-center overflow-hidden transition-all ease-in-out">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-x-4 md:gap-x-6 lg:gap-x-10 sm:px-2 md:mx-4 p-2 w-full">
            {/* ḷeft */}
            <div className=" flex flex-col self-start mx-auto max-h-fit items-center">
              <div className=" mb-2 object-cover  flex justify-center aspect-square w-96 sm:w-[350px rounded-md mb-5 md:w-[430px] lg:w-[530px] overflow-hidden shadow-md shadow-purple-100 p-2">
                <img
                  src={images[index]}
                  alt="main product image"
                  className="object-contain"
                  // style={{ objectFit: 'contain' }}
                  loading="lazy"
                />
              </div>
              <div className="flex mx-auto w-fit justify-center  items-center gap-x-6  px-5">
                {images.length > 0 &&
                  images.map((value, ind) => (
                    <div
                      className={`h-20 w-16 p-1 hover:shadow-lg lg:h-28 lg:w-20 mx-auto flex justify-center items-center bg-white border-2 border-purple-${
                        index === ind ? '600' : '50'
                      } rounded-xl  `}
                      key={ind}
                      onClick={() => setIndex(ind)}
                      // onMouseOver={() => setIndex(ind)}
                    >
                      <img
                        src={value}
                        alt="product sub images"
                        className={`object-contain h-full min-h-fit border-purple-${
                          index === ind ? '500' : '50'
                        }`}
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* right */}
            <div className="flex gap-y-2 max-sm:mx-3 md:px-4 mr-3 flex-col self-start w-full mx-auto px-2 mt-6 ">
              <p className="text-xs text-sky-600">Brand: {brand}</p>
              <h1 className="text-xl font-medium capitalize">{name}</h1>

              {/* rating */}
              <div className="flex gap-x-3 max-md:flex-col whitespace-nowrap text-sky-600">
                <Rate allowHalf defaultValue={avgRating} disabled />
                {numOfReviews !== 0 ? (
                  <p className="whitespace-nowrap">
                    {numOfReviews} {numOfReviews === 1 ? 'review' : 'reviews'}
                  </p>
                ) : (
                  <p>No ratings yet</p>
                )}
              </div>

              {/* price */}
              {discount && discount > 0 ? (
                <div className="flex flex-col mt-3 gap-y-0 mb-2">
                  <div className="flex">
                    <p className="font-semibold">{'\u20B9 '}</p>
                    <p className="text-2xl sm:text-3xl  font-bold text-slate-900">{`${Math.round(
                      (price * (100 - discount)) / 100
                    )}`}</p>
                  </div>
                  <div className="flex mt-1 text-gray-500 line-through">
                    <p className="font-medium text-xs">{'\u20B9 '}</p>
                    <p className="text-sm sm:text-md  font-medium  h-3 ">{`${price}`}</p>
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <p className="mt-2 font-semibold">{'\u20B9 '}</p>
                  <p className="text-3xl my-2 font-bold text-slate-900">{`${price}`}</p>
                </div>
              )}

              <div className="flex items-center  gap-x-3">
                <h2>Stock status:</h2>
                <p
                  className={`text-${
                    stock < 50 ? 'red-500' : 'sky-600'
                  } text whitespace-nowrap `}
                >
                  {stock < 50 ? `Hurry, only ${stock} left!` : 'Available'}
                </p>
              </div>

              {/* description */}
              <div className="bg-violet-100 flex flex-col p-1 py-3 my-3 items-start rounded-lg">
                <h2 className="text-lg font-medium ml-1">Description</h2>
                <p
                  className={`text-base leading-snug  whitespace-pre-wrap px-1 ${
                    isExpanded ? '' : 'line-clamp-3'
                  }`}
                >
                  {description}
                </p>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-500 self-end mr-2 mt-2"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              </div>

              {/* buttons */}
              <div className="flex flex-col mx-auto min-w-fit whitespace-nowrap my-4 max-w-[450px] w-full text-lg font-semibold  gap-y-4 ">
                <button
                  className="bg-violet-700 px-3 py-2 hover:shadow-md   sm:mx-10 rounded-lg text-lg  text-white "
                  style={{ background: COLORS.GRADIENT }}
                >
                  Add to cart
                </button>
                <button
                  className="bg-violet-700 px-3 hover:shadow-md  py-2 sm:mx-10 rounded-lg text-lg text-white "
                  style={{ background: COLORS.NAV_GRADIENT }}
                >
                  Buy now
                </button>
              </div>
            </div>
          </div>
          {/* reviews */}
          <div className="bg-violet-50 mx-4 flex flex-col py-3 my-3 items-start rounded-lg p-2 ">
            <p className="text-lg font-medium ml-1 mb-3">Reviews</p>
            {reviews.length > 0 ? (
              <div className="bg-violet-200 rounded-2xl p-2 w-full">
                <h2>Ajesh</h2>
                <p>rating: 4/5</p>
                <p>Best phone of the year</p>
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-500">
                No reviews yet
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
export default ProductDetailsPage
