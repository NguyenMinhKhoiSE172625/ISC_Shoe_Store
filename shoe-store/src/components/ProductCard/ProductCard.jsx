import { Link } from "react-router-dom"
import "./ProductCard.css"

const ProductCard = ({ product, isLoggedIn, addToCart }) => {
  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <div className="product-image">
          <img src={product.image || "/placeholder.svg"} alt={product.name} />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-brand">{product.brand}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      {isLoggedIn && (
        <button className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      )}
    </div>
  )
}

export default ProductCard

