"use client"

import { useState, useEffect } from "react"
import { useProducts } from "../../contexts/ProductContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons"
import ProductCard from "../../components/ProductCard/ProductCard"
import "./ProductsPage.css"

const ProductsPage = () => {
  const { products, loading, fetchProducts, searchProducts } = useProducts()
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState("default")
  const [availableBrands, setAvailableBrands] = useState([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isSearching, setIsSearching] = useState(false)

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
      
      // Apply filters and search
      applyFiltersAndSearch();
    }
  }, [products]);

  // Apply filters and search whenever these values change
  useEffect(() => {
    if (products.length > 0) {
      applyFiltersAndSearch();
    }
  }, [filter, sort, searchTerm]);

  const applyFiltersAndSearch = () => {
    // First filter by brand
    let filtered = products;
    
    if (filter !== "all") {
      filtered = filtered.filter(product => 
        product.brand.toLowerCase() === filter.toLowerCase()
      );
    }
    
    // Then apply search term
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(lowercaseSearch) || 
        product.brand.toLowerCase().includes(lowercaseSearch) ||
        product.description?.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    // Finally, sort the results
    const sorted = [...filtered].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    
    setFilteredProducts(sorted);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  }

  const handleSortChange = (e) => {
    setSort(e.target.value);
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      await fetchProducts();
      return;
    }
    
    setIsSearching(true);
    
    try {
      const results = await searchProducts(searchTerm);
      if (results && results.length > 0) {
        // Let the filtering system handle this
        applyFiltersAndSearch();
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="products-page">
      <h1 className="page-title">Tất Cả Sản Phẩm</h1>

      <div className="search-and-filters">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <input 
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên, thương hiệu..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              aria-label="Tìm kiếm sản phẩm"
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="search-button" 
              disabled={isSearching}
              aria-label="Tìm kiếm"
              title="Tìm kiếm"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </form>
        
        <div className="filters-container">
          <div className="filter-icon">
            <FontAwesomeIcon icon={faFilter} />
          </div>
          
          <div className="filter-group">
            <label htmlFor="brand-filter">Thương hiệu:</label>
            <select id="brand-filter" value={filter} onChange={handleFilterChange} className="filter-select">
              <option value="all">Tất cả</option>
              {availableBrands.map(brand => (
                <option key={brand} value={brand.toLowerCase()}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-filter">Sắp xếp:</label>
            <select id="sort-filter" value={sort} onChange={handleSortChange} className="filter-select">
              <option value="default">Mặc định</option>
              <option value="price-low">Giá: Thấp đến Cao</option>
              <option value="price-high">Giá: Cao đến Thấp</option>
              <option value="name">Tên</option>
            </select>
          </div>
        </div>
      </div>

      {loading || isSearching ? (
        <div className="loading">Đang tải sản phẩm...</div>
      ) : (
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="no-products">
              <p>Không tìm thấy sản phẩm nào phù hợp.</p>
              <button onClick={() => {
                setSearchTerm("");
                setFilter("all");
                fetchProducts();
              }} className="reset-filters-btn">
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductsPage

