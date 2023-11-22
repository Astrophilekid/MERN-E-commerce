import cron from 'node-cron'
import Order from '../Models/ordersModel.js'

cron.schedule('0 0 * * *', async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  await Order.deleteMany({ status: 'Pending', createdAt: { $lt: oneDayAgo } })
})
