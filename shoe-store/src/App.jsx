"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PageTransition from "./components/PageTransition/PageTransition"
import ProtectedStaffRoute from './components/ProtectedStaffRoute/ProtectedStaffRoute'
import { USER_ROLES } from './constants/userRoles'

// Context Providers
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider, useCart } from './contexts/CartContext'
import { ProductProvider } from './contexts/ProductContext'

// Components
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import StaffOrderManagement from './components/StaffOrderManagement/StaffOrderManagement'

// Pages
import HomePage from "./pages/HomePage/HomePage"
import ProductsPage from "./pages/ProductsPage/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage"
import LoginPage from "./pages/LoginPage/LoginPage"
import RegisterPage from "./pages/RegisterPage/RegisterPage"
import CartPage from "./pages/CartPage/CartPage"
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage"
import OrderTracking from './pages/OrderTracking/OrderTracking'

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
            <Route path="/orders" element={<OrderTracking />} />
            <Route 
              path="/staff/orders" 
              element={
                <ProtectedStaffRoute>
                  <StaffOrderManagement />
                </ProtectedStaffRoute>
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

