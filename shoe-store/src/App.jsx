"use client"

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PageTransition from "./components/PageTransition/PageTransition"

// Context Providers
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider, useCart } from './contexts/CartContext'
import { ProductProvider } from './contexts/ProductContext'

// Components
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"

// Pages
import HomePage from "./pages/HomePage/HomePage"
import ProductsPage from "./pages/ProductsPage/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage"
import AdminProductsPage from "./pages/AdminProductsPage/AdminProductsPage"
import LoginPage from "./pages/LoginPage/LoginPage"
import RegisterPage from "./pages/RegisterPage/RegisterPage"
import CartPage from "./pages/CartPage/CartPage"
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage"
import CheckoutSuccess from "./pages/CheckoutSuccess/CheckoutSuccess"
import CheckoutCancel from "./pages/CheckoutCancel/CheckoutCancel"
import OrdersPage from "./pages/OrdersPage/OrdersPage"
import OrderDetailsPage from "./pages/OrderDetailsPage/OrderDetailsPage"
import ProfilePage from "./pages/ProfilePage/ProfilePage"

// Styles
import "./App.css"

// Định nghĩa ProtectedRoute component
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  return children;
}

// Định nghĩa AdminRoute component
function AdminRoute({ children }) {
  const { isLoggedIn, user, loading } = useAuth();
  const location = useLocation();
  const isAdmin = user && user.role === 'admin';

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  return children;
}

// Tạo một component con để sử dụng context hooks
function AppContent() {
  const location = useLocation()
  const { isLoggedIn, user, logout, loading } = useAuth()
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, getCartCount } = useCart()
  
  // Safe cart count calculation
  const safeCartCount = () => {
    try {
      return getCartCount() || 0;
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  };

  // Check if user is admin
  const isAdmin = user && user.role === 'admin';
  
  return (
    <div className="app">
      <Header 
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={logout}
        cartItemCount={safeCartCount()}
        isAdmin={isAdmin}
      />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route 
              path="/" 
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              } 
            />
            <Route 
              path="/products" 
              element={
                <PageTransition>
                  <ProductsPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/products/:id" 
              element={
                <PageTransition>
                  <ProductDetailPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <PageTransition>
                  <CartPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PageTransition>
                  <RegisterPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <CheckoutPage />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <ProfilePage />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <OrdersPage />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders/:id" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <OrderDetailsPage />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-success/:id" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <CheckoutSuccess />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-cancel/:id" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <CheckoutCancel />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <AdminRoute>
                  <PageTransition>
                    <AdminProductsPage />
                  </PageTransition>
                </AdminRoute>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ 
          fontSize: '0.9rem',
          zIndex: 9999
        }}
      />
    </div>
  )
}

// App component with contexts
function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

