import mongoose from 'mongoose'
import addressSchema from './addressModel.js'

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
    shippingAddress: {
      type: Object,
      default: null,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: String,
    status: {
      type: String,
      enum: ['Pending', 'Placed', 'Shipped', 'Delivered'],
      default: 'Placed',
    },
    delivery: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
    },
  },
  { timestamps: true }
)

const Order = mongoose.model('Orders', orderSchema)
export default Order
