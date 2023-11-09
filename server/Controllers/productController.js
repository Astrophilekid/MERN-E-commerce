import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv'
dotenv.config()
import User from '../Models/userModel.js'
import Product from '../Models/productModel.js'
import { generateToken } from '../Utils/generateToken.js'

//@desc Get All Products
//@route GET/api/v1/products/view-all-products
//@access public
const viewAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 8 //

  try {
    const totalProducts = await Product.countDocuments({ softDelete: false })

    const products = await Product.find({ softDelete: false })
      .populate('reviews.user', 'username')
      .limit(limit)
      .skip((page - 1) * limit)

    res.status(200).json({
      message: 'Products fetched successfully',
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      error: 'Could not fetch Products: ' + error,
    })
  }
})

//@desc Get Specific Products
//@route GET/api/v1/products/view-product/:id
//@access public
const viewProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'product id required',
      })
    }
    const product = await Product.findById(id).populate(
      'reviews.user',
      'username'
    )

    res.status(200).json({
      message: 'Product fetched successfully',
      success: true,
      product,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      error: 'Could not fetch Product' + error,
    })
  }
})

//@desc Get Products by category
//@route GET/api/v1/products/filter?
//@access public
const viewProductsByFilter = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 8
  const { category, year, brand, sortBy, sortOrder } = req.query

  try {
    let query = {}

    if (category && category !== 'deleted-products') {
      query.category = category
      query.softDelete = false
    } else if (category === 'deleted-products') {
      query.softDelete = true
    } else {
      query.softDelete = false
    }

    if (year) {
      query.year = year
    }

    if (brand) {
      query.brand = brand
    }

    if (category === 'deleted-products') {
      // Fetch products with softDelete based on category
      query.softDelete = true
    } else {
      // Fetch products with softDelete as false for other categories
      query.softDelete = false
    }

    const totalProducts = await Product.countDocuments(query)

    const products = await Product.find(query)
      .populate('reviews.user', 'username')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .limit(limit)
      .skip((page - 1) * limit)

    res.status(200).json({
      message: 'Products fetched successfully',
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      error: 'Could not fetch Products ' + error,
    })
  }
})

//@desc Product Search Suggestion
//@route GET/api/v1/products/search-term/?searchTerm
//@access public
const searchSuggestion = asyncHandler(async (req, res) => {
  const { searchTerm } = req.query

  if (!searchTerm) {
    res.status(400).json({
      success: false,
      message: 'Search query required!',
    })
    return
  }

  try {
    const suggestions = await Product.find(
      { name: { $regex: '^' + searchTerm, $options: 'i' }, softDelete: false },
      { name: 1, _id: 0 }
    ).limit(10)

    res.status(200).json({
      success: true,
      message: 'Products suggestion fetched successfully',
      suggestions,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch products suggestion:' + error,
    })
  }
})

//@desc Search Product by Name
//@route GET /api/v1/products/searchProduct
//@access public
const searchProduct = asyncHandler(async (req, res) => {
  const { productName } = req.query

  try {
    const product = await Product.find({
      name: { $regex: productName, $options: 'i' },
      softDelete: false,
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Product found successfully',
      product: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error finding the product: ' + error,
    })
  }
})

export {
  viewAllProducts,
  viewProduct,
  viewProductsByFilter,
  searchSuggestion,
  searchProduct,
}