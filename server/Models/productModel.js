import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['smartphone', 'smartwatch', 'laptop', 'tab'],
    required: true,
  },
  brand: { type: String, default: '', required: true },
  description: {
    type: String,
    trim: false,
    required: [true, 'Product description required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price required'],
  },
  images: {
    type: [
      {
        type: String,
        required: true,
      },
    ],
    validate: [
      {
        validator: function (arr) {
          return arr.length >= 1 && arr.length <= 4
        },
        message:
          'The "images" array must contain at least one image and up to 4 images (1 main and 3 sub-images).',
      },
    ],
  },
  discount: { type: Number, default: 0 },
  Stock: {
    type: Number,
    required: [true, 'Please Enter product Stock'],
    maxLength: [4, 'Stock cannot exceed 4 characters'],
    default: 1,
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },
  avgRating: {
    type: Number,
    default: 0,
  },
  softDelete: {
    type: Boolean,
    default: false,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
        default: '',
      },
    },
  ],
})

productSchema.pre('save', function (next) {
  if (this.reviews.length > 0) {
    let sum = this.reviews.reduce((total, review) => {
      return total + review.rating
    }, 0)
    this.avgRating = sum / this.reviews.length
  } else {
    this.avgRating = 0
  }
  next()
})

const Product = mongoose.model('Product', productSchema)
export default Product
