"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import PageTransition from "./components/PageTransition/PageTransition"

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

// Tạo một component con để sử dụng useLocation
function AppContent({ 
  isLoggedIn, 
  user, 
  handleLogin,
  handleLogout,
  cart, 
  addToCart, 
  updateQuantity,
  removeFromCart,
  clearCart 
}) {
  const location = useLocation()
  
  return (
    <div className="app">
      <Header 
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
        cartItemCount={cart.reduce((total, item) => total + item.quantity, 0)}
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
                  <ProductsPage isLoggedIn={isLoggedIn} addToCart={addToCart} />
                </PageTransition>
              } 
            />
            <Route 
              path="/products/:id" 
              element={
                <PageTransition>
                  <ProductDetailPage isLoggedIn={isLoggedIn} addToCart={addToCart} />
                </PageTransition>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <PageTransition>
                  <CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} isLoggedIn={isLoggedIn} />
                </PageTransition>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PageTransition>
                  <LoginPage onLogin={handleLogin} />
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
                <PageTransition>
                  <CheckoutPage cart={cart} clearCart={clearCart} />
                </PageTransition>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

// Component App chính
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])

  const handleLogin = (userData) => {
    setIsLoggedIn(true)
    setUser(userData)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
  }

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <Router>
      <AppContent 
        isLoggedIn={isLoggedIn}
        user={user}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        cart={cart}
        addToCart={addToCart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
    </Router>
  )
}

export default App

