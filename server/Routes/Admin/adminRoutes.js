import express from 'express'
const router = express.Router()
import { isAdmin } from '../../Middlewares/isAdminMiddleware.js'
import upload from '../../Middlewares/uploadMiddleware.js'

//user controllers imports
import {
  searchUser,
  adminLogin,
  adminLogout,
  updateUserStatus,
  viewAllUsers,
  searchSuggestion,
} from '../../Controllers/Admin/adminUserController.js'

//product controllers imports
import {
  addProduct,
  updateProduct,
  toggleSoftDelete,
} from '../../Controllers/Admin/adminProductController.js'

//order controllers import
import {
  updateOrderStatus,
  viewOrders,
} from '../../Controllers/Admin/AdminOrderController.js'
import { getProfile } from '../../Controllers/userController.js'

//admin routes
router.post('/login', adminLogin)
router.post('/logout', adminLogout)
router.get('/profile', isAdmin, getProfile)

//admin-product routes
router.post('/add-product', isAdmin, upload.array('images', 4), addProduct)
router.put('/update-product', isAdmin, upload.array('images', 4), updateProduct)
router.patch('/toggle-soft-delete/:id', isAdmin, toggleSoftDelete)

//admin-user routes
router.patch('/update-user-status/:id', isAdmin, updateUserStatus)
router.get('/view-all-users', isAdmin, viewAllUsers)
router.get('/search-user', isAdmin, searchUser)
router.get('/search-suggestion', isAdmin, searchSuggestion)

//admin order routes
router.get('/orders', isAdmin, viewOrders)
router.put('/orders/update-status/:orderId', isAdmin, updateOrderStatus)

export { router as adminRouter }
