import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv'
dotenv.config()
import User from '../Models/userModel.js'
import Product from '../Models/productModel.js'
import { generateToken } from '../Utils/generateToken.js'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  {
    lazyLoading: true,
  }
)

//@desc Send OTP before registering
//@route POST/api/v1/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, mobile } = req.body

  if (!name || !email || !password || !mobile) {
    res
      .status(400)
      .json({ message: 'All fields are mandatory', success: false })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    res.status(400).json({ message: 'Email already in use', success: false })
  }

  try {
    const otpResponse = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({
        to: `+91${mobile}`,
        channel: 'sms',
      })
    res.status(200).json({
      message: `OTP send successfully to ${mobile}`,
      success: true,
    })
  } catch (error) {
    res.status(error?.status || 400).json({
      message: error?.message || 'something went wrong in sending otp!',
      success: false,
    })
  }
})

//@desc Verify user's OTP and register
//@route POST//api/v1/users/verify-otp
//@access public
const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, mobile, otp } = req.body
    if (!name || !email || !password || !mobile || !otp) {
      res.status(400).json({
        errorType: 'MissingFields',
        message: 'All fields are mandatory',
        success: false,
      })
    }

    const verifiedResponse = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${mobile}`,
        code: otp,
      })
    if (verifiedResponse.status === 'approved') {
      const user = await User.create({
        name,
        email,
        password,
        mobile,
      })

      res.status(201).json({
        message: `OTP verified and User registered successfully`,
        success: true,
      })
    } else if (verifiedResponse.status === 'expired') {
      return res.status(400).json({
        errorType: 'ExpiredOTP',
        message: 'OTP expired',
        success: false,
      })
    } else {
      return res.status(400).json({
        errorType: 'OTPVerificationFailed',
        message: 'OTP verification failed',
        success: false,
      })
    }
  } catch (error) {
    res.status(error?.status || 400).json({
      message: error?.message || 'Something went wrong',
      success: false,
    })
  }
})

//@desc Login user
//@route POST/api/v1/users/Login
//@access public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res
      .status(400)
      .json({ message: 'All fields are mandatory', success: false })
  }

  const user = await User.findOne({ email }).select('+password')

  // console.log(user, email, password)
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      message: 'user logged in successfully',
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

// @desc   Logout user
// route   POST/api/v1/users/logout
// @access Public
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  })

  res.status(200).json({ success: true, message: 'Log out successful' })
})

export { registerUser, verifyOTP, login, logout }
