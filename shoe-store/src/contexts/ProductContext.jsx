import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { productsAPI } from '../services/api';
import { toast } from 'react-toastify';

// Create product context
export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products - memoized with useCallback
  const fetchProducts = useCallback(async (queryString = '') => {
    try {
      setLoading(true);
      setError(null);
      const finalQueryString = queryString.includes('limit') 
        ? queryString 
        : (queryString ? `${queryString}&limit=1000` : '?limit=1000');
      
      const { data } = await productsAPI.getProducts(finalQueryString);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      toast.error('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch a single product by ID
  const fetchProductById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productsAPI.getProduct(id);
      return data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      toast.error('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Create a new product
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      console.log("ProductContext - Gửi dữ liệu tạo sản phẩm:", productData);
      const { data } = await productsAPI.createProduct(productData);
      // Refresh the products list after creating
      fetchProducts();
      toast.success('Sản phẩm đã được tạo thành công!');
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      // Log chi tiết lỗi
      if (error.response) {
        console.error("Chi tiết lỗi:", error.response.data);
        console.error("Trạng thái HTTP:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("Không nhận được phản hồi. Chi tiết request:", error.request);
      } else {
        console.error("Lỗi cấu hình request:", error.message);
      }
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Không thể tạo sản phẩm. Vui lòng thử lại sau.';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Update a product
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productsAPI.updateProduct(id, productData);
      
      // Update the product in the local state
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === id ? data : product
        )
      );
      
      toast.success('Sản phẩm đã được cập nhật thành công!');
      return data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      const errorMessage = error.response?.data?.message || 'Không thể cập nhật sản phẩm. Vui lòng thử lại sau.';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Delete a product
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await productsAPI.deleteProduct(id);
      
      // Remove the product from the local state
      setProducts(prevProducts => 
        prevProducts.filter(product => product._id !== id)
      );
      
      toast.success('Sản phẩm đã được xóa thành công!');
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      const errorMessage = error.response?.data?.message || 'Không thể xóa sản phẩm. Vui lòng thử lại sau.';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchProducts = async (searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productsAPI.searchProducts(searchTerm);
      return data;
    } catch (error) {
      console.error('Error searching products:', error);
      setError('Không thể tìm kiếm sản phẩm. Vui lòng thử lại sau.');
      toast.error('Không thể tìm kiếm sản phẩm. Vui lòng thử lại sau.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Format price to VND
  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        searchProducts,
        formatVND
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 