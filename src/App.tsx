import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TiendaLogin from './pages/TiendaLogin'
import TiendaRegister from './pages/TiendaRegister'
import ProductCatalog from './pages/ProductCatalog'
import ProductDetail from './pages/ProductDetail'
import ShoppingCart from './pages/ShoppingCart'
import Checkout from './pages/Checkout'
import PaymentMethod from './pages/PaymentMethod'
import SkinQuiz from './pages/SkinQuiz'
import FindBoutiquePage from './pages/FindBoutiquePage'
import CustomerDashboard from './pages/CustomerDashboard'
import VendorDashboard from './pages/VendorDashboard'
import AddProduct from './pages/AddProduct'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* ─── USER SECTION — Header + Footer layout ─── */}
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
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute rol="cliente">
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* ─── VENDOR PORTAL — standalone pages (no sidebar) ─── */}
            <Route path="/panel/login" element={<TiendaLogin />} />
            <Route path="/panel/register" element={<TiendaRegister />} />

            {/* ─── VENDOR PANEL — AdminLayout (sidebar) ─── */}
            <Route
              element={
                <ProtectedRoute rol={['tienda', 'admin']} redirectTo="/panel/login">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/panel/dashboard" element={<VendorDashboard />} />
              <Route path="/panel/productos" element={<VendorDashboard />} />
              <Route path="/panel/productos/nuevo" element={<AddProduct />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
