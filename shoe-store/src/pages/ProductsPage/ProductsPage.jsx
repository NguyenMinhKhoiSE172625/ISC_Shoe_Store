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
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(8) // Hiển thị 8 sản phẩm mỗi trang

  // Tính toán sản phẩm trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  // Thay đổi trang
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    // Cuộn lên đầu trang khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Only fetch products once on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts("?page=1&limit=100");
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };
    
    loadProducts();
  }, [fetchProducts]);

  // Extract available brands when products change
  useEffect(() => {
    if (products && products.length > 0) {
      const brands = [...new Set(products.map(product => product.brand))];
      setAvailableBrands(brands);
      
      // Apply filters and search
      applyFiltersAndSearch();
    }
  }, [products]);

  // Apply filters and search whenever these values change
  useEffect(() => {
    if (products && products.length > 0) {
      applyFiltersAndSearch();
      // Reset về trang 1 khi thay đổi bộ lọc
      setCurrentPage(1);
    }
  }, [filter, sort, searchTerm, products]);

  const applyFiltersAndSearch = () => {
    if (!products || products.length === 0) return;
    
    try {
      // First filter by brand
      let filtered = [...products];
      
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
    } catch (error) {
      console.error('Lỗi khi lọc sản phẩm:', error);
      setFilteredProducts(products);
    }
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
      await fetchProducts("?page=1&limit=100");
      return;
    }
    
    setIsSearching(true);
    
    try {
      const results = await searchProducts(searchTerm);
      if (results && results.length > 0) {
        setFilteredProducts(results);
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
        <>
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="no-products">
                <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                <button onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                  fetchProducts("?page=1&limit=100");
                }} className="reset-filters-btn">
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
          
          {/* Phân trang */}
          {filteredProducts && filteredProducts.length > productsPerPage && (
            <div className="pagination">
              <button 
                className="pagination-prev-button" 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                aria-label="Trang trước"
              >
                Trước
              </button>
              
              <div className="pagination-container">
                <div className="pagination-numbers">
                  {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map((_, index) => {
                    const pageNumber = index + 1;
                    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
                    
                    // Hiển thị các số trang và dấu "..." nếu cần
                    if (pageNumber <= 5 || pageNumber === totalPages) {
                      return (
                        <button
                          key={pageNumber}
                          className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                          onClick={() => paginate(pageNumber)}
                          aria-label={`Trang ${pageNumber}`}
                          aria-current={currentPage === pageNumber ? 'page' : null}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    
                    // Hiển thị dấu "..." giữa những trang
                    if (pageNumber === 6 && totalPages > 6) {
                      return <span key="ellipsis" className="pagination-ellipsis">...</span>;
                    }
                    
                    return null;
                  })}
                </div>
              </div>
              
              <button 
                className="pagination-next-button" 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                aria-label="Trang sau"
              >
                Trang sau
              </button>
            </div>
          )}
          
          {/* Thông tin tổng sản phẩm */}
          {filteredProducts && filteredProducts.length > 0 && (
            <div className="pagination-info">
              <p>Tổng sản phẩm: {filteredProducts.length} | Số trang: {Math.ceil(filteredProducts.length / productsPerPage)} | Trang hiện tại: {currentPage}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductsPage

