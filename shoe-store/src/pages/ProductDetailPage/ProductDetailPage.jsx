"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./ProductDetailPage.css"

// Mock product data (same as in ProductsPage)
const mockProducts = [
  {
    id: 1,
    name: "Air Max 90",
    brand: "Nike",
    price: 129.99,
    priceVND: 129.99 * 23000,
    image: "https://ash.vn/cdn/shop/files/407eb5f254e3e3bb1853bb33f08cdf02_1800x.jpg?v=1730711456",
    description:
      "Giày Nike Air Max 90 trung thành với nguồn gốc chạy bộ OG với đế ngoài Waffle mang tính biểu tượng, lớp phủ khâu và các chi tiết TPU cổ điển. Các màu sắc cổ điển tôn lên vẻ ngoài tươi mới của bạn trong khi đệm Max Air mang lại sự thoải mái cho hành trình của bạn.",
    sizes: [7, 8, 9, 10, 11, 12],
  },
  {
    id: 2,
    name: "Ultraboost 21",
    brand: "Adidas",
    price: 149.99,
    priceVND: 149.99 * 23000,
    image: "https://product.hstatic.net/200000386993/product/1_dff50e2bf44043f89b8283048428a68b_master.jpg",
    description:
      "Ultraboost 21. Kỷ nguyên mới trong chạy bộ Adidas. Khả năng hoàn trả năng lượng đáng kinh ngạc, đệm boost đáp ứng và thiết kế bền vững hơn.",
    sizes: [7, 8, 9, 10, 11, 12],
  },
  {
    id: 3,
    name: "Classic Leather",
    brand: "Reebok",
    price: 89.99,
    priceVND: 89.99 * 23000,
    image: "https://myshoes.vn/image/data/product/reebok/giay-Reebok-Classic-Leather-nam-trang-01.jpg",
    description:
      "Giày Reebok Classic Leather lần đầu xuất hiện vào năm 1983 và đã trở thành một phần không thể thiếu trong văn hóa đường phố kể từ đó. Phiên bản này của những đôi giày biểu tượng có phần trên bằng da sạch sẽ cho vẻ ngoài và cảm giác cao cấp.",
    sizes: [7, 8, 9, 10, 11],
  },
  {
    id: 4,
    name: "Old Skool",
    brand: "Vans",
    price: 69.99,
    priceVND: 69.99 * 23000,
    image: "https://drake.vn/image/catalog/H%C3%ACnh%20content/Vans-Skate-Old-Skool/vans-skate-old-skool-09.jpg",
    description:
      "Old Skool, giày trượt ván cổ điển của Vans và là mẫu đầu tiên mang sọc bên mang tính biểu tượng, có kiểu dáng thấp cổ với phần trên bằng da lộn và vải canvas bền bỉ với lưỡi và lớp lót đệm và đế ngoài Waffle đặc trưng của Vans.",
    sizes: [6, 7, 8, 9, 10, 11, 12],
  },
  {
    id: 5,
    name: "Chuck Taylor",
    brand: "Converse",
    price: 59.99,
    priceVND: 59.99 * 23000,
    image: "https://product.hstatic.net/200000265619/product/568497c-thumb-web_19a679fd48aa48a4a50eae354087309c_1024x1024.jpg",
    description:
      "Chuck Taylor All Star Classic tôn vinh kiểu dáng cao cổ mang tính biểu tượng với phần trên bằng vải canvas bền bỉ trong nhiều màu sắc theo mùa. Lót giày OrthoLite đệm cho từng bước đi. Nó vẫn mang tính biểu tượng như mọi khi, nhưng được thiết kế với sự thoải mái hơn.",
    sizes: [6, 7, 8, 9, 10, 11],
  },
  {
    id: 6,
    name: "Suede Classic",
    brand: "Puma",
    price: 79.99,
    priceVND: 79.99 * 23000,
    image: "https://myshoes.vn/image/data/product11/8.12.17/giay-Puma-suede-classic-nam-navy-01.JPG",
    description:
      "Suede xuất hiện vào năm 1968 và đã thay đổi cuộc chơi kể từ đó. Nó đã được các biểu tượng của mọi thế hệ sử dụng, và nó vẫn giữ được tính cổ điển qua tất cả.",
    sizes: [7, 8, 9, 10, 11, 12],
  },
  {
    id: 7,
    name: "Gel-Kayano 28",
    brand: "Asics",
    price: 159.99,
    priceVND: 159.99 * 23000,
    image: "https://images.asics.com/is/image/asics/1012B133_020_SR_RT_GLB?$zoom$",
    description:
      "Tận hưởng sự thoải mái tuyệt vời và hỗ trợ nâng cao với giày chạy bộ GEL-KAYANO 28. Bộ phận gót chân bên ngoài có thiết kế thấp giúp giữ chân bạn ổn định và mang lại bước đi thoải mái hơn.",
    sizes: [7, 8, 9, 10, 11],
  },
  {
    id: 8,
    name: "Fresh Foam 1080",
    brand: "New Balance",
    price: 149.99,
    priceVND: 149.99 * 23000,
    image: "https://www.theathletesfoot.co.nz/media/catalog/product/cache/30b15c9880beb2a1230f6de71d9a1f9d/w/1/w1080f13_2.jpg",
    description:
      "Fresh Foam 1080 là đỉnh cao của giày chạy bộ hiệu suất của chúng tôi. Đế giữa Fresh Foam mang lại đệm cao cấp qua từng dặm, trong khi phần trên bằng lưới thoáng khí mang lại sự vừa vặn thoải mái.",
    sizes: [7, 8, 9, 10, 11, 12],
  },
]

const ProductDetailPage = ({ isLoggedIn, addToCart }) => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [error, setError] = useState("")

  // Hàm định dạng giá tiền VND
  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

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
      setError("Vui lòng chọn kích cỡ")
      toast.error("Vui lòng chọn kích cỡ giày trước khi thêm vào giỏ hàng!", toastOptions)
      return
    }

    addToCart({
      ...product,
      selectedSize,
    })

    // Thay thế alert bằng toast
    toast.success(`${product.name} (Kích cỡ: ${selectedSize}) đã được thêm vào giỏ hàng!`, toastOptions)
  }

  if (loading) {
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
      <ToastContainer />
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

