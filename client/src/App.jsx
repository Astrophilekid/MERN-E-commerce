import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, persistor } from './store.js'
import { PersistGate } from 'redux-persist/integration/react'
import Layout from './Layout.jsx'
import AdminLayout from './AdminLayout.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import axios from 'axios'
import {
  AdminHomePage,
  OrdersPage,
  UserPage,
  AdminLoginPage,
  ProductsPage,
} from './pages/admin'
import ProductDetailsPage from './pages/ProductDetailsPage.jsx'
import AdminProfilePage from './pages/admin/AdminProfilePage.jsx'
import ProductsCategoryPage from './pages/ProductsCategoryPage.jsx'
import AdminViewProductsPage from './pages/admin/products/AdminViewProductsPage.jsx'
import AdminProductDetailsPage from './pages/admin/products/AdminProductDetailsPage.jsx'
import CartPage from './pages/CartPage.jsx'

axios.defaults.baseURL = 'http://localhost:4000/api/v1'
axios.defaults.withCredentials = true

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />

            {/* user layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route
                path="/products/:category"
                element={<ProductsCategoryPage />}
              />
              <Route path="/cart" element={<CartPage />} />
            </Route>

            {/* admin layout */}
            <Route path="admin/*" element={<AdminLayout />}>
              <Route index element={<AdminHomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route
                path="products/:category"
                element={<AdminViewProductsPage />}
              />
              <Route path="product/:id" element={<AdminProductDetailsPage />} />
              <Route path="users" element={<UserPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  )
}
export default App
