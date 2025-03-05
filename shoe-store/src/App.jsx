"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

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
      <div className="app">
        <Header
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={handleLogout}
          cartItemCount={cart.reduce((total, item) => total + item.quantity, 0)}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage isLoggedIn={isLoggedIn} addToCart={addToCart} />} />
            <Route path="/products/:id" element={<ProductDetailPage isLoggedIn={isLoggedIn} addToCart={addToCart} />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <RegisterPage />} />
            <Route
              path="/cart"
              element={
                <CartPage
                  cart={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/checkout"
              element={!isLoggedIn ? <Navigate to="/login" /> : <CheckoutPage cart={cart} clearCart={clearCart} />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

