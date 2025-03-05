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
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    name: "Ultraboost 21",
    brand: "Adidas",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 3,
    name: "Classic Leather",
    brand: "Reebok",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 4,
    name: "Old Skool",
    brand: "Vans",
    price: 69.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 5,
    name: "Chuck Taylor",
    brand: "Converse",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 6,
    name: "Suede Classic",
    brand: "Puma",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 7,
    name: "Gel-Kayano 28",
    brand: "Asics",
    price: 159.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 8,
    name: "Fresh Foam 1080",
    brand: "New Balance",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
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
      <h1 className="page-title">All Products</h1>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="brand-filter">Filter by Brand:</label>
          <select id="brand-filter" value={filter} onChange={handleFilterChange} className="filter-select">
            <option value="all">All Brands</option>
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
          <label htmlFor="sort-filter">Sort by:</label>
          <select id="sort-filter" value={sort} onChange={handleSortChange} className="filter-select">
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-grid">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} addToCart={addToCart} />
            ))
          ) : (
            <div className="no-products">No products found.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductsPage

