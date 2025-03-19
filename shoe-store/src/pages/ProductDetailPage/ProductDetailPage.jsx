"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { useAuth } from "../../contexts/AuthContext"
import { useCart } from "../../contexts/CartContext"
import { useProducts } from "../../contexts/ProductContext"
import "./ProductDetailPage.css"

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const { addToCart } = useCart()
  const { fetchProductById, formatVND, loading: productsLoading } = useProducts()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [error, setError] = useState("")

  // Cấu hình toast
  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  }

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const productData = await fetchProductById(id)
        
        if (!productData) {
          navigate('/products')
          return
        }
        
        setProduct(productData)
        
        // Set default size
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0])
        }
      } catch (error) {
        console.error('Error loading product:', error)
        toast.error('Không thể tải thông tin sản phẩm', toastOptions)
      } finally {
        setLoading(false)
      }
    }
    
    loadProduct()
  }, [id, fetchProductById, navigate])

  const handleSizeSelect = (size) => {
    setSelectedSize(size)
    setError("")
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError("Vui lòng chọn kích cỡ")
      toast.error("Vui lòng chọn kích cỡ giày trước khi thêm vào giỏ hàng!", toastOptions)
      return
    }

    try {
      // Create product with selected size
      const productToAdd = {
        ...product,
        selectedSize
      }
      
      await addToCart(productToAdd)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.', toastOptions)
    }
  }

  if (loading || productsLoading) {
    return <div className="loading">Đang tải thông tin sản phẩm...</div>
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Không Tìm Thấy Sản Phẩm</h2>
        <p>Xin lỗi, sản phẩm bạn đang tìm kiếm không tồn tại.</p>
        <Link to="/products" className="btn btn-primary">
          Quay Lại Trang Sản Phẩm
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
          <p className="product-detail-price">{formatVND(product.priceVND)}</p>

          <div className="product-description">
            <h3>Mô Tả</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-sizes">
            <h3>Chọn Kích Cỡ</h3>
            <div className="size-options">
              {product.sizes?.map((size) => (
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
              Thêm Vào Giỏ Hàng
            </button>
          ) : (
            <div className="login-prompt">
              <p>
                Vui lòng <Link to="/login">đăng nhập</Link> để thêm sản phẩm vào giỏ hàng.
              </p>
            </div>
          )}

          <Link to="/products" className="back-link">
            &larr; Quay Lại Trang Sản Phẩm
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage

