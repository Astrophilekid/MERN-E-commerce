import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv'
import Cart from '../Models/cartModel.js'
dotenv.config()
import Product from '../Models/productModel.js'

//@desc Get all cart items
//@route GET/api/v1/cart/view-cart
//@access Private
const viewCart = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const cartItems = await Cart.findOne({ user: userId })
    .populate('products.product')
    .exec()

  if (!cartItems || cartItems.products.length === 0) {
    return res.status(200).json({
      message: 'Your cart is empty',
      cart: !!cartItems,
      success: true,
    })
  }

  res.status(200).json({
    cartItems,
    cart: true,
    success: true,
    message: 'Cart found successfully',
  })
})

//@desc Add product to the cart
//@route POST/api/v1/cart/add
//@access Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body
  const userId = req.user.id

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({
      message: 'Invalid product details',
      success: false,
    })
  }

  try {
    let userCart = await Cart.findOne({ user: userId })
    if (!userCart) {
      userCart = await Cart.create({ user: userId, products: [] })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        success: false,
      })
    }

    const existingProduct = userCart.products.find((item) =>
      item.product.equals(productId)
    )

    if (existingProduct) {
      existingProduct.quantity += quantity
    } else {
      userCart.products.push({
        product: productId,
        quantity,
      })
    }

    userCart.totalPrice = userCart.products.reduce((total, item) => {
      const productPrice = product.price * item.quantity
      return total + productPrice
    }, 0)

    await userCart.save()

    res.status(200).json({
      message: 'Product added to the cart successfully',
      success: true,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
})

export { viewCart, addToCart }
