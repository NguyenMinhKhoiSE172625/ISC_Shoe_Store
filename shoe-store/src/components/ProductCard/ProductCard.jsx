import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useCart } from "../../contexts/CartContext"
import { useProducts } from "../../contexts/ProductContext"
import "./ProductCard.css"

const ProductCard = ({ product }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const { isLoggedIn } = useAuth()
  const { addToCart } = useCart()
  const { formatVND } = useProducts()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isAnimating) return // Prevent multiple clicks during animation
    
    setIsAnimating(true)
    await addToCart(product)
    
    // Reset animation after completion
    setTimeout(() => {
      setIsAnimating(false)
    }, 1500)
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-image">
          <img src={product.image || "/placeholder.svg"} alt={product.name} />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-brand">{product.brand}</p>
          <p className="product-price">{formatVND(product.priceVND)}</p>
        </div>
      </Link>
      {isLoggedIn && (
        <div className="button-container">
          <motion.button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            disabled={isAnimating}
          >
            {isAnimating ? "Đã thêm! ✓" : "Thêm vào giỏ"}
          </motion.button>
          <AnimatePresence>
            {isAnimating && (
              <motion.div
                className="success-ring"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 0],
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  duration: 1,
                  times: [0, 0.5, 1],
                  ease: "easeInOut"
                }}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default ProductCard

