import Order from '../Models/ordersModel.js'
import Product from '../Models/productModel.js'

async function getTotalSalesPerCategory() {
  try {
    const totalSalesPerCategory = await Order.aggregate([
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          quantitySold: { $sum: '$products.quantity' },
        },
      },
      {
        $lookup: {
          from: 'products', // Replace with the actual collection name of the Product model
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          totalSales: { $sum: '$quantitySold' },
        },
      },
    ])

    return totalSalesPerCategory
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export { getTotalSalesPerCategory }
