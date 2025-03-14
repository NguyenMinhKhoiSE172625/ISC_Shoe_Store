"use client"

import { useState, useEffect } from "react"
import ProductCard from "../../components/ProductCard/ProductCard"
import "./ProductsPage.css"

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: "Air Max 90",
    brand: "Nike",
    price: 129.99,
    priceVND: 129.99 * 23000,
    image: "https://ash.vn/cdn/shop/files/407eb5f254e3e3bb1853bb33f08cdf02_1800x.jpg?v=1730711456",
  },
  {
    id: 2,
    name: "Ultraboost 21",
    brand: "Adidas",
    price: 149.99,
    priceVND: 149.99 * 23000,
    image: "https://product.hstatic.net/200000386993/product/1_dff50e2bf44043f89b8283048428a68b_master.jpg",
  },
  {
    id: 3,
    name: "Classic Leather",
    brand: "Reebok",
    price: 89.99,
    priceVND: 89.99 * 23000,
    image: "https://myshoes.vn/image/data/product/reebok/giay-Reebok-Classic-Leather-nam-trang-01.jpg",
  },
  {
    id: 4,
    name: "Old Skool",
    brand: "Vans",
    price: 69.99,
    priceVND: 69.99 * 23000,
    image: "https://drake.vn/image/catalog/H%C3%ACnh%20content/Vans-Skate-Old-Skool/vans-skate-old-skool-09.jpg",
  },
  {
    id: 5,
    name: "Chuck Taylor",
    brand: "Converse",
    price: 59.99,
    priceVND: 59.99 * 23000,
    image: "https://product.hstatic.net/200000265619/product/568497c-thumb-web_19a679fd48aa48a4a50eae354087309c_1024x1024.jpg",
  },
  {
    id: 6,
    name: "Suede Classic",
    brand: "Puma",
    price: 79.99,
    priceVND: 79.99 * 23000,
    image: "https://myshoes.vn/image/data/product11/8.12.17/giay-Puma-suede-classic-nam-navy-01.JPG",
  },
  {
    id: 7,
    name: "Gel-Kayano 28",
    brand: "Asics",
    price: 159.99,
    priceVND: 159.99 * 23000,
    image: "https://images.asics.com/is/image/asics/1012B133_020_SR_RT_GLB?$zoom$",
  },
  {
    id: 8,
    name: "Fresh Foam 1080",
    brand: "New Balance",
    price: 149.99,
    priceVND: 149.99 * 23000,
    image: "https://www.theathletesfoot.co.nz/media/catalog/product/cache/30b15c9880beb2a1230f6de71d9a1f9d/w/1/w1080f13_2.jpg",
  },
]

const ProductsPage = ({ isLoggedIn, addToCart }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState("default")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 500)
  }, [])

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const handleSortChange = (e) => {
    setSort(e.target.value)
  }

  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true
    return product.brand.toLowerCase() === filter
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-low") return a.price - b.price
    if (sort === "price-high") return b.price - a.price
    if (sort === "name") return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div className="products-page">
      <h1 className="page-title">Tất Cả Sản Phẩm</h1>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="brand-filter">Lọc theo Thương hiệu:</label>
          <select id="brand-filter" value={filter} onChange={handleFilterChange} className="filter-select">
            <option value="all">Tất cả Thương hiệu</option>
            <option value="nike">Nike</option>
            <option value="adidas">Adidas</option>
            <option value="reebok">Reebok</option>
            <option value="vans">Vans</option>
            <option value="converse">Converse</option>
            <option value="puma">Puma</option>
            <option value="asics">Asics</option>
            <option value="new balance">New Balance</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-filter">Sắp xếp theo:</label>
          <select id="sort-filter" value={sort} onChange={handleSortChange} className="filter-select">
            <option value="default">Mặc định</option>
            <option value="price-low">Giá: Thấp đến Cao</option>
            <option value="price-high">Giá: Cao đến Thấp</option>
            <option value="name">Tên</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải sản phẩm...</div>
      ) : (
        <div className="products-grid">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} addToCart={addToCart} />
            ))
          ) : (
            <div className="no-products">Không tìm thấy sản phẩm nào.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductsPage

