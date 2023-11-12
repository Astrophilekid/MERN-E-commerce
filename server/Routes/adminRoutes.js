import express from 'express'
const router = express.Router()

import {
  adminLogin,
  adminLogout,
  addProduct,
  updateUserStatus,
  viewAllUsers,
  searchUser,
  updateProduct,
  toggleSoftDelete,
} from '../Controllers/adminController.js'

import { isAdmin } from '../Middlewares/isAdminMiddleware.js'
import upload from '../Middlewares/uploadMiddleware.js'

router.post('/login', adminLogin)
router.post('/logout', adminLogout)
// admin-product route
router.post('/add-product', isAdmin, upload.array('images', 4), addProduct)
router.put('/update-product', isAdmin, upload.array('images', 4), updateProduct)
router.patch('/toggle-soft-delete/:id', isAdmin, toggleSoftDelete)
// admin-user route
router.patch('/update-user-status/:id', isAdmin, updateUserStatus)
router.get('/view-all-users', isAdmin, viewAllUsers)
router.get('/search-user', isAdmin, searchUser)

export { router as adminRouter }
