import { useEffect, useState } from 'react'
import CartCard from '../components/CartCard'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCart } from '../slices/cartSlice'
import CartSkelton from '../components/skeltons/CartSkelton'
import { fetchCart } from '../api'
import AddressModal from '../components/modals/addressModal'

const CartPage = () => {
  const [isCartLoading, setIsCartLoading] = useState(true)
  const [addressModal, setAddressModal] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const myCart = useSelector((state) => state.cart.cartItems)
  const totalPrice = useSelector((state) => state.cart.totalPrice)
  const totalQuantity = useSelector((state) => state.cart.totalQuantity)

  const fetchData = async () => {
    setIsCartLoading(true)
    try {
      const { success, cart, totalPrice, totalQuantity } = await fetchCart()
      // console.log(success, cart, totalPrice, totalQuantity)
      if (success) {
        dispatch(
          setCart({
            cart,
            totalPrice,
            totalQuantity,
          })
        )
        setTimeout(() => {
          setIsCartLoading(false)
        }, 500)
      }
    } catch (error) {
      alert('something went wrong while fetching cart')
      setIsCartLoading(false)
    }
  }

  const makePayment = () => {
    try {
      axios
        .post('/payment/new-order')
        .then(({ data }) => {
          console.log(data)
          const order = data.savedOrder

          var options = {
            key: import.meta.env.VITE_RZP_ID,
            amount: order.total * 100,
            currency: 'INR',
            name: 'Your Company Name',
            description: 'Test Transaction',
            order_id: order.orderId,
            handler: function (response) {
              axios
                .post('/payment/pay', {
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                })
                .then(({ data }) => {
                  const transaction = data
                  console.log(transaction)
                })
                .catch((error) => {
                  console.log(error)
                })
            },
            prefill: {
              name: 'Customer Ajesh',
              email: 'customer@example.com',
              contact: '9999999999',
            },
            notes: {
              address: 'Your Company Address',
            },
            theme: {
              color: '#61dafb',
            },
          }
          var rzp1 = new window.Razorpay(options)
          rzp1.open()
        })
        .catch((err) => console.log(err))
    } catch (error) {
      console.log('catch block error: ', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="mx-1 md:mx-10 min-h-fit max-md:mb-40">
      {isCartLoading ? (
        <>
          <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center text-violet-700 mb-5 pl-5">
            <button
              className="bg-red-400 px-2 py-1 flex mt-2 rounded-md text-white text-lg text-center mr-3 transition-transform duration-200 hover:scale-105 active:scale-95"
              onClick={() => navigate(-1)}
            >
              <img src="/go back.png" alt="go back" className="h-6" />
              <h2>back</h2>
            </button>
            My Cart
            <img
              src="../../assets/icons/purple cart.png"
              alt="cart icon"
              className="object-contain ml-2 h-9"
            />
          </div>
          {Array(4)
            .fill()
            .map((_, index) => (
              <CartSkelton key={index} />
            ))}
        </>
      ) : (
        <>
          <div className="w-full  px-3 flex justify-center min-h-fit pb-10 gap-x-4 overflow-hidden">
            <div
              className={`sm:w-full ${
                !isCartLoading && myCart?.length > 0 && 'sm:w-2/3'
              } w-full `}
            >
              <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center text-violet-700 mb-5 pl-5">
                <button
                  className="bg-red-400 px-2 py-1 flex mt-2 rounded-md text-white text-lg text-center mr-3 transition-transform duration-200 hover:scale-105 active:scale-95"
                  onClick={() => navigate(-1)}
                >
                  <img src="/go back.png" alt="go back" className="h-6" />
                  <h2>back</h2>
                </button>
                My Cart
                <img
                  src="../../assets/icons/purple cart.png"
                  alt="cart icon"
                  className="object-contain ml-2 h-9"
                />
              </div>
              {!isCartLoading && myCart?.length > 0 ? (
                myCart.map((product, i) => (
                  <CartCard product={product} key={i} />
                ))
              ) : (
                <div className="w-full h-96  flex flex-col items-center justify-center text-xl font-medium text-gray-700">
                  No items in your cart!
                  <Link
                    to={'/'}
                    className="underline text-violet-400 hover:text-violet-600"
                  >
                    continue shopping
                  </Link>
                </div>
              )}
            </div>
            {addressModal && (
              <AddressModal
                makePayment={makePayment}
                setAddressModal={setAddressModal}
              />
            )}
            {/* right */}
            {!isCartLoading && myCart?.length > 0 && (
              <div className="max-md:hidden mt-16 max-w-[250px] flex relative top-4 h-44 flex-col text-lg  justify-between rounded-md shadow-lg p-2 w-1/3 whitespace-nowrap bg-violet-300 ">
                <div className="my-auto flex flex-col gap-y-3">
                  <div className="flex w-full justify-between">
                    total items:{' '}
                    <p className="text-lg font-medium mr-3">{totalQuantity}</p>
                  </div>
                  <div className="flex  w-full justify-between">
                    total :{' '}
                    <p className="text-lg font-medium">{totalPrice}/-</p>
                  </div>
                </div>
                <button
                  className="w-full h-10 mt-auto flex justify-center bg-gradient-to-tr from-violet-700 to-red-400  items-center text-lg shadow-md  rounded text-white transition-all active:scale-95 hover:text-[19px] hover:scale-100  "
                  onClick={() => {
                    setAddressModal(true)
                  }}
                >
                  Buy Now
                </button>
              </div>
            )}

            {/* mobile fixed */}
            {!isCartLoading && myCart?.length > 0 && (
              <div className="hidden max-md:flex gap-x-5 fixed bottom-3 right-4 left-4 h-20 rounded-md border bg-violet-300 py-2 shadow-xl">
                {/* left */}
                <div className="w-3/5 flex text-lg flex-col justify-center  p-3">
                  <div className="flex w-full border-black pb-4 justify-between">
                    total items:{' '}
                    <p className="mr-3 font-medium">{totalQuantity}</p>
                  </div>

                  <div className="flex  w-full justify-between">
                    total price:{' '}
                    <p className="text-lg font-semibold">{totalPrice}/-</p>
                  </div>
                </div>
                {/* right */}
                <button
                  className="w-1/5 ml-auto h-full m-2 my-2 mt-auto flex justify-center bg-gradient-to-tr from-violet-700 to-red-400  items-center text-lg shadow-md  rounded text-white hover:text-[18px] transition-all active:scale-95  hover:shadow-lg"
                  onClick={() => {
                    setAddressModal(true)
                  }}
                >
                  Buy Now
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
export default CartPage