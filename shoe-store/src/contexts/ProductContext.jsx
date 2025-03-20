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
      const { data } = await productsAPI.getProducts(queryString);
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

  // Search products
  const searchProducts = async (searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productsAPI.searchProducts(searchTerm);
      return data || [];
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