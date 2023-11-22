import asyncHandler from 'express-async-handler'
import Cart from '../Models/cartModel.js'
import Order from '../Models/ordersModel.js'
import Product from '../Models/productModel.js'
import Address from '../Models/addressModel.js'
import Transaction from '../Models/transactionModel.js'
import { createOrderFn } from '../Utils/razorpay.js'

//@desc Place the order
//@route POST/api/v1/payment/new-order
//@access private
const createOrder = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id
    const cart = await Cart.findOne({ user: userId })

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found.' })
    }

    const address = await Address.findOne({ user: userId })

    if (!address) {
      return res
        .status(404)
        .json({ success: false, error: 'Address not found.' })
    }

    const total = cart.totalPrice
    const products = cart.products

    const order = await createOrderFn(total)

    if (!order) {
      return res
        .status(500)
        .json({ success: false, error: 'Failed to create the order.' })
    }

    const newOrder = new Order({
      userId: userId,
      orderId: order.id,
      products: products,
      shippingAddress: {},
      total: total,
      status: 'Pending',
    })
    const savedOrder = await newOrder.save()

    res.status(200).json({
      message: 'order created successfully',
      success: true,
      savedOrder,
    })
  } catch (error) {
    console.error('server error in the create order controller : ', error)
  }
})

//@desc confirm payment
//@route POST/api/v1/payment/pay
//@access private
const confirmPayment = asyncHandler(async (req, res) => {
  try {
    const { orderId, paymentId } = req.body

    const order = await Order.findOne({ orderId }).populate('products.product')

    if (order) {
      order.status = 'Placed'
      await order.save()

      for (const item of order.products) {
        const product = item.product
        const orderedQty = item.quantity

        const fetchedProduct = await Product.findById(product._id)

        if (fetchedProduct) {
          fetchedProduct.stock -= orderedQty
          await fetchedProduct.save()
        }
      }

      const transaction = new Transaction({
        userId: order.userId,
        amount: order.total,
        type: 'Credit',
        paymentId: paymentId,
        orderId: orderId,
        status: 'success',
      })
      const savedTransaction = await transaction.save()

      res.status(200).json({
        success: true,
        message: 'Payment successful',
        savedTransaction,
      })
    } else {
      res.status(404).json({
        success: false,
        error: 'Order not found',
      })
    }
  } catch (error) {
    console.error('Something went wrong during payment: ', error)
    res.status(500).json({
      success: false,
      error: 'Something went wrong during payment',
    })
  }
})

export { createOrder, confirmPayment }
