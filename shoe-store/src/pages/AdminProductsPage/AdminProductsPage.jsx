import React, { useState, useEffect } from "react";
import { useProducts } from "../../contexts/ProductContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faSpinner, faTimes, faCheck, faSearch, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "./AdminProductsPage.css";

const AdminProductsPage = () => {
  const { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct, searchProducts } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    priceVND: "",
    description: "",
    image: "",
    sizes: [],
    inStock: true
  });
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([
    35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45
  ]);
  
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8); // Hiển thị 8 sản phẩm mỗi trang cho admin
  
  // Tính toán sản phẩm trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Chuyển tới trang trước
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Chuyển tới trang sau
  const goToNextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Update filtered products when products or search term changes
  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts("?page=1&limit=100");
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };
    
    // Tải sản phẩm khi component mount
    loadProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (products && products.length > 0) {
      if (searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        const filtered = products.filter(product => 
          product.name.toLowerCase().includes(lowercaseSearch) || 
          product.brand.toLowerCase().includes(lowercaseSearch)
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(products);
      }
      // Reset về trang 1 khi thay đổi bộ lọc
      setCurrentPage(1);
    }
  }, [products, searchTerm]);

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await fetchProducts("?page=1&limit=100");
      return;
    }
    
    try {
      const searchResults = await searchProducts(searchTerm);
      setFilteredProducts(searchResults || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      priceVND: "",
      description: "",
      image: "",
      sizes: [],
      inStock: true
    });
    setIsEditing(false);
    setCurrentProductId(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "priceVND") {
      // Only allow numbers
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({ 
        ...formData, 
        [name]: numericValue
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle checkbox changes for sizes
  const handleSizeToggle = (size) => {
    if (formData.sizes.includes(size)) {
      setFormData({
        ...formData,
        sizes: formData.sizes.filter(s => s !== size)
      });
    } else {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, size].sort((a, b) => a - b)
      });
    }
  };

  // Load product data for editing
  const handleEditClick = (product) => {
    setFormData({
      name: product.name,
      brand: product.brand,
      priceVND: product.priceVND.toString(),
      description: product.description,
      image: product.image,
      sizes: product.sizes || [],
      inStock: product.inStock || true
    });
    setIsEditing(true);
    setCurrentProductId(product._id);
    setShowForm(true);
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.brand || !formData.priceVND || !formData.image || formData.sizes.length === 0) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }
    
    // Chỉnh sửa dữ liệu theo đúng API backend
    const productData = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      price: parseInt(formData.priceVND, 10) / 24000, // Tính ngược lại giá USD từ VND
      priceVND: parseInt(formData.priceVND, 10),
      description: formData.description.trim(),
      image: formData.image.trim(),
      sizes: formData.sizes.map(size => Number(size)).sort((a, b) => a - b),
      inStock: formData.inStock
    };
    
    console.log("Đang gửi dữ liệu sản phẩm:", productData);
    console.log("Kiểm tra kiểu dữ liệu: ", {
      name: typeof productData.name,
      brand: typeof productData.brand,
      price: typeof productData.price,
      priceVND: typeof productData.priceVND,
      description: typeof productData.description,
      sizes: Array.isArray(productData.sizes) ? "array" : typeof productData.sizes,
      image: typeof productData.image,
      inStock: typeof productData.inStock
    });
    
    try {
      if (isEditing) {
        await updateProduct(currentProductId, productData);
      } else {
        await createProduct(productData);
      }
      
      // Reset form
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      
      // Log chi tiết lỗi từ backend
      if (error.response) {
        console.error("Phản hồi từ server:", error.response.data);
        console.error("Mã lỗi:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("Không nhận được phản hồi. Chi tiết request:", error.request);
      } else {
        console.error("Lỗi cấu hình request:", error.message);
      }
      
      // Hiển thị thông báo lỗi cụ thể từ backend nếu có
      if (error.response?.data?.error) {
        alert(`Lỗi: ${error.response.data.error}`);
      } else if (error.response?.data?.message) {
        alert(`Lỗi: ${error.response.data.message}`);
      } else {
        alert("Có lỗi xảy ra khi lưu sản phẩm. Vui lòng kiểm tra console để biết thêm chi tiết.");
      }
    }
  };

  // Handle delete product
  const handleDeleteClick = (productId) => {
    setConfirmDelete(productId);
  };

  const confirmDeleteProduct = async () => {
    if (!confirmDelete) return;
    
    try {
      await deleteProduct(confirmDelete);
      setConfirmDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  return (
    <div className="admin-products-page">
      <h1 className="page-title">Quản lý sản phẩm</h1>
      
      <div className="admin-actions">
        <div className="search-container">
          <input 
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        
        <button 
          className="add-product-btn" 
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Thêm sản phẩm
        </button>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="products-table-container">
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>Không tìm thấy sản phẩm nào.</p>
              </div>
            ) : (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên</th>
                    <th>Thương hiệu</th>
                    <th>Giá (VNĐ)</th>
                    <th>Kích cỡ</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="product-thumbnail"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td>{product.priceVND.toLocaleString("vi-VN")}đ</td>
                      <td>{product.sizes?.join(", ")}</td>
                      <td className="actions-cell">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditClick(product)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteClick(product._id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Phân trang */}
          {filteredProducts && filteredProducts.length > productsPerPage && (
            <div className="pagination">
              <button 
                className="pagination-button" 
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              
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
              
              {currentPage < Math.ceil(filteredProducts.length / productsPerPage) && (
                <div className="pagination-next">
                  <button 
                    className="pagination-next-button" 
                    onClick={goToNextPage}
                  >
                    Trang Sau <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              )}
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
      
      {/* Product Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="product-form-modal">
            <div className="modal-header">
              <h2>{isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</h2>
              <button className="close-modal-btn" onClick={() => setShowForm(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label htmlFor="name">Tên sản phẩm:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="brand">Thương hiệu:</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Nhập thương hiệu"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="priceVND">Giá (VNĐ):</label>
                <input
                  type="text"
                  id="priceVND"
                  name="priceVND"
                  value={formData.priceVND}
                  onChange={handleInputChange}
                  placeholder="Nhập giá sản phẩm (VNĐ)"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Mô tả:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả sản phẩm"
                  rows="4"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="inStock">Trạng thái:</label>
                <select
                  id="inStock"
                  name="inStock"
                  value={formData.inStock}
                  onChange={(e) => setFormData({...formData, inStock: e.target.value === "true"})}
                >
                  <option value="true">Còn hàng</option>
                  <option value="false">Hết hàng</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Kích cỡ:</label>
                <div className="sizes-container">
                  {availableSizes.map((size) => (
                    <div key={size} className="size-checkbox">
                      <input
                        type="checkbox"
                        id={`size-${size}`}
                        checked={formData.sizes.includes(size)}
                        onChange={() => handleSizeToggle(size)}
                      />
                      <label htmlFor={`size-${size}`}>{size}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="image">URL hình ảnh:</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Nhập URL hình ảnh"
                  required
                />
              </div>
              
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="Xem trước" />
                </div>
              )}
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Hủy
                </button>
                <button type="submit" className="save-btn">
                  {isEditing ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={cancelDelete}>
                Hủy
              </button>
              <button className="confirm-btn" onClick={confirmDeleteProduct}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage; 