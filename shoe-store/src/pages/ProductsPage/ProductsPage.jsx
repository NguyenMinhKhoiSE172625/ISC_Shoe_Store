"use client"

import { useState, useEffect } from "react"
import { useProducts } from "../../contexts/ProductContext"
import ProductCard from "../../components/ProductCard/ProductCard"
import "./ProductsPage.css"

const ProductsPage = () => {
  const { products, loading, fetchProducts } = useProducts()
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState("default")
  const [availableBrands, setAvailableBrands] = useState([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Only fetch products once on component mount
  useEffect(() => {
    if (isInitialLoad) {
      // Only call fetchProducts on the initial load
      fetchProducts();
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, fetchProducts]);

  // Extract available brands when products change
  useEffect(() => {
    if (products.length > 0) {
      const brands = [...new Set(products.map(product => product.brand))];
      setAvailableBrands(brands);
    }
  }, [products]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const handleSortChange = (e) => {
    setSort(e.target.value)
  }

  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true
    return product.brand.toLowerCase() === filter.toLowerCase()
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
            {availableBrands.map(brand => (
              <option key={brand} value={brand.toLowerCase()}>
                {brand}
              </option>
            ))}
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
              <ProductCard key={product._id} product={product} />
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

