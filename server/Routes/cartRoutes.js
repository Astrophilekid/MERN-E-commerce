import express from 'express'
const router = express.Router()

import validateToken from '../Middlewares/authMiddleware.js'
import { viewCart } from '../Controllers/cartController.js'

router.get('/view-cart', validateToken, viewCart)

export { router as cartRouter }
