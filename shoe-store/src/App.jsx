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
import LoginPage from "./pages/LoginPage/LoginPage"
import RegisterPage from "./pages/RegisterPage/RegisterPage"
import CartPage from "./pages/CartPage/CartPage"
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage"

// Styles
import "./App.css"

// Tạo một component con để sử dụng context hooks
function AppContent() {
  const location = useLocation()
  const { isLoggedIn, user, logout } = useAuth()
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
  
  return (
    <div className="app">
      <Header 
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={logout}
        cartItemCount={safeCartCount()}
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
                isLoggedIn ? (
                  <PageTransition>
                    <CheckoutPage />
                  </PageTransition>
                ) : (
                  <Navigate to="/login" state={{ from: '/checkout' }} />
                )
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

