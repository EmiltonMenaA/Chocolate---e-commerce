import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductCatalog from './pages/ProductCatalog'
import ProductDetail from './pages/ProductDetail'
import ShoppingCart from './pages/ShoppingCart'
import Checkout from './pages/Checkout'
import SkinQuiz from './pages/SkinQuiz'
import CustomerDashboard from './pages/CustomerDashboard'
import VendorDashboard from './pages/VendorDashboard'
import PaymentMethod from './pages/PaymentMethod'
import AddProduct from './pages/AddProduct'
import FindBoutiquePage from './pages/FindBoutiquePage'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductCatalog />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<PaymentMethod />} />
            <Route path="/skin-quiz" element={<SkinQuiz />} />
            <Route path="/find-boutique" element={<FindBoutiquePage />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/vendor-dashboard/add-product" element={<AddProduct />} />
          </Route>
        </Routes>
      </CartProvider>
    </Router>
  )
}

export default App
