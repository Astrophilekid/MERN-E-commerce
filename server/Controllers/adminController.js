import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv'
dotenv.config()
import Product from '../Models/productModel.js'
import User from '../Models/userModel.js'
import { generateToken } from '../Utils/generateToken.js'

//@desc Admin Login
//@route POST/api/v1/admin/Login
//@access public
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({
      errorType: 'MissingFields',
      message: 'All fields are mandatory',
      success: false,
    })
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.matchPassword(password))) {
    res.status(401).json({
      errorType: 'InvalidCredentials',
      message: 'Invalid email or password!',
      success: false,
    })
  }

  if (!user.isAdmin) {
    res.status(401).json({
      errorType: 'NotAuthorized',
      message: 'user is not an admin!',
      success: false,
    })
  }

  // console.log(user, email, password)
  if (user.isAdmin && (await user.matchPassword(password))) {
    const token = generateToken(user._id)
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      message: 'admin logged in successfully',
      success: true,
    })
  } else {
    res.status(401).json({
      errorType: 'InvalidCredentials',
      message: 'Invalid email or password!',
      success: false,
    })
  }
})

// @desc   Logout Admin
// route   POST/api/v1/admin/logout
// @access Public
const adminLogout = asyncHandler(async (req, res) => {
  res.cookie('adminToken', '', {
    httpOnly: true,
    expires: new Date(0),
  })

  res.status(200).json({ success: true, message: 'Log out successful' })
})

//@desc View all Users
//@route POST/api/v1/admin/view-all-users
//@access private
const viewAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 8 //

  try {
    const totalUsers = await User.countDocuments() // Count total number of products

    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit) // Limit the number of products per page
      .skip((page - 1) * limit) // Skip products based on the current page and limit

    res.status(200).json({
      message: 'Users fetched successfully',
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      error: 'Could not fetch Users: ' + error,
    })
  }
})

//@desc Update user status
//@route PATCH /api/v1/admin/update-user-status/:id
//@access private
const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { isBlocked, isAdmin } = req.body

  if (!id) {
    res.status(404).json({
      success: false,
      message: 'User ID required!',
    })
    return
  }

  try {
    const user = await User.findById(id)

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      })
      return
    }

    if (isBlocked !== undefined) {
      user.isBlocked = isBlocked
    }
    if (isAdmin !== undefined) {
      user.isAdmin = isAdmin
    }

    await user.save()

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not update user status: ' + error,
    })
  }
})

//@desc Admin Search User
//@route GET/api/v1/admin/search-user
//@access private
const searchUser = asyncHandler(async (req, res) => {
  const { query } = req.query

  if (!query) {
    res.status(400).json({
      success: false,
      message: 'Search query required!',
    })
    return
  }

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { mobile: { $regex: query, $options: 'i' } },
      ],
    })

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch users:' + error,
    })
  }
})

//@desc Add Product
//@route POST/api/v1/admin/add-product
//@access private
const addProduct = asyncHandler(async (req, res) => {
  const { name, category, brand, description, price, stock, discount } =
    req.body

  if (!name || !category || !brand || !description || !price || !stock) {
    return res.status(400).json({
      errorType: 'MissingFields',
      message: 'All fields are mandatory',
      success: false,
    })
  }

  console.log(req.files)

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'At least one image is required' })
  }

  const images = req.files.map((file) => file.path)

  // console.log(name, category, brand, description, price, stock, images)

  const product = new Product({
    name,
    category,
    brand,
    description,
    discount,
    price,
    stock,
    images: images,
  })

  try {
    const result = await product.save()

    return res.status(201).json({
      message: 'Product created successfully',
      success: true,
      product: result,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Server error',
      success: false,
    })
  }
})

export {
  adminLogin,
  adminLogout,
  viewAllUsers,
  updateUserStatus,
  searchUser,
  addProduct,
}
