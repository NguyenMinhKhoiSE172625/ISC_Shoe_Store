"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import "./ProductDetailPage.css"

// Mock product data (same as in ProductsPage)
const mockProducts = [
  {
    id: 1,
    name: "Air Max 90",
    brand: "Nike",
    price: 129.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle outsole, stitched overlays and classic TPU details. Classic colors celebrate your fresh look while Max Air cushioning adds comfort to your journey.",
    sizes: [7, 8, 9, 10, 11, 12],
  },
  {
    id: 2,
    name: "Ultraboost 21",
    brand: "Adidas",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Ultraboost 21. The new era in Adidas running. Incredible energy return, responsive boost cushioning and a more sustainable design.",
    sizes: [7, 8, 9, 10, 11, 12],
  },
  {
    id: 3,
    name: "Classic Leather",
    brand: "Reebok",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "The Reebok Classic Leather shoes first hit the scene in 1983 and have been a staple in street culture ever since. This version of the iconic sneakers has a clean leather upper for a premium look and feel.",
    sizes: [7, 8, 9, 10, 11],
  },
  {
    id: 4,
    name: "Old Skool",
    brand: "Vans",
    price: 69.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "The Old Skool, Vans classic skate shoe and the first to bear the iconic side stripe, has a low-top lace-up silhouette with a durable suede and canvas upper with padded tongue and lining and Vans signature Waffle Outsole.",
    sizes: [6, 7, 8, 9, 10, 11, 12],
  },
  {
    id: 5,
    name: "Chuck Taylor",
    brand: "Converse",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "The Chuck Taylor All Star Classic celebrates the iconic high top silhouette with a durable canvas upper in a range of seasonal colors. An OrthoLite insole cushions each and every step. It's just as iconic as ever, but designed with more comfort.",
    sizes: [6, 7, 8, 9, 10, 11],
  },
  {
    id: 6,
    name: "Suede Classic",
    brand: "Puma",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "The Suede hit the scene in 1968 and has been changing the game ever since. It's been worn by icons of every generation, and it's stayed classic through it all.",
    sizes: [7, 8, 9, 10, 11, 12],
  },
  {
    id: 7,
    name: "Gel-Kayano 28",
    brand: "Asics",
    price: 159.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Enjoy excellent comfort and advanced support with the GEL-KAYANO 28 running shoe. The redesigned low-profile external heel counter helps keep your foot stable and provide a more comfortable stride.",
    sizes: [7, 8, 9, 10, 11],
  },
  {
    id: 8,
    name: "Fresh Foam 1080",
    brand: "New Balance",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "The Fresh Foam 1080 is the pinnacle of our performance running shoes. The Fresh Foam midsole delivers premium cushioning mile after mile, while the breathable mesh upper offers a comfortable fit.",
    sizes: [7, 8, 9, 10, 11, 12],
  },
]

const ProductDetailPage = ({ isLoggedIn, addToCart }) => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundProduct = mockProducts.find((p) => p.id === Number.parseInt(id))
      if (foundProduct) {
        setProduct(foundProduct)
      }
      setLoading(false)
    }, 500)
  }, [id])

  const handleSizeSelect = (size) => {
    setSelectedSize(size)
    setError("")
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size")
      return
    }

    addToCart({
      ...product,
      selectedSize,
    })

    alert(`${product.name} (Size: ${selectedSize}) added to cart!`)
  }

  if (loading) {
    return <div className="loading">Loading product details...</div>
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>Sorry, the product you are looking for does not exist.</p>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image-container">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-detail-image" />
        </div>

        <div className="product-info-container">
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-brand">{product.brand}</p>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-sizes">
            <h3>Select Size</h3>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-option ${selectedSize === size ? "selected" : ""}`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>

          {isLoggedIn ? (
            <button className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          ) : (
            <div className="login-prompt">
              <p>
                Please <Link to="/login">login</Link> to add items to your cart.
              </p>
            </div>
          )}

          <Link to="/products" className="back-link">
            &larr; Back to Products
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage

