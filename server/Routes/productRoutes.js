import express from 'express'
const router = express.Router()

import validateToken from '../Middlewares/authMiddleware.js'

import {
  viewAllProducts,
  viewProduct,
  viewProductsByFilter,
  searchSuggestion,
  searchProduct,
} from '../Controllers/productController.js'

router.get('/searchProduct', searchProduct)
router.get('/view-all-products', viewAllProducts)
router.get('/search-term', searchSuggestion)
router.get('/filter', viewProductsByFilter)
router.get('/:id', viewProduct)

export { router as productsRouter }
