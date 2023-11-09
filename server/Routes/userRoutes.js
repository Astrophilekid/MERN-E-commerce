import express from 'express'
const router = express.Router()

import validateToken from '../Middlewares/authMiddleware.js'

import {
  registerUser,
  verifyOTP,
  login,
  logout,
} from '../Controllers/userController.js'

router.post('/register', registerUser)
router.post('/verify-otp', verifyOTP)
router.post('/login', login)
router.post('/logout', logout)

export { router as userRouter }
