import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import { dirname } from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { errorHandler, notFound } from './Middlewares/errorHandler.js'
import connectDb from './Config/dbConnection.js'
import { userRouter } from './Routes/userRoutes.js'
import { adminRouter } from './Routes/adminRoutes.js'
import { productsRouter } from './Routes/productRoutes.js'
import { cartRouter } from './Routes/cartRoutes.js'

connectDb()

const port = process.env.PORT || 4000

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/products', productsRouter)
app.use('/api/v1/cart', cartRouter)

//error handling middlewares
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is listening to port ${port}`)
})
