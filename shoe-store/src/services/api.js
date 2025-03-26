import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.get('/auth/logout');
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/auth/updatedetails', userData);
    return response.data;
  },
  
  updatePassword: async (passwordData) => {
    const response = await api.put('/auth/updatepassword', passwordData);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getProducts: async (query = '') => {
    const response = await api.get(`/products${query}`);
    return response.data;
  },
  
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  searchProducts: async (searchTerm) => {
    const response = await api.get(`/products/search?q=${searchTerm}`);
    return response.data;
  },

  // Admin API methods
  createProduct: async (productData) => {
    console.log("API - Sending product data:", productData);
    // Đảm bảo dữ liệu phù hợp với schema của backend
    const validData = {
      name: productData.name,
      brand: productData.brand,
      price: productData.price,
      priceVND: productData.priceVND || productData.price * 24000, // Tính giá VND nếu không có
      image: productData.image,
      description: productData.description || '',
      sizes: productData.sizes || [],
      inStock: productData.inStock !== undefined ? productData.inStock : true
    };
    console.log("API - Formatted data:", validData);
    const response = await api.post('/products', validData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    console.log("API - Updating product:", id, productData);
    // Đảm bảo dữ liệu phù hợp với schema của backend
    const validData = {
      name: productData.name,
      brand: productData.brand,
      price: productData.price,
      priceVND: productData.priceVND || productData.price * 24000, // Tính giá VND nếu không có
      image: productData.image,
      description: productData.description || '',
      sizes: productData.sizes || [],
      inStock: productData.inStock !== undefined ? productData.inStock : true
    };
    const response = await api.put(`/products/${id}`, validData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

// Cart API
export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  
  addToCart: async (productData) => {
    const response = await api.post('/cart/items', productData);
    return response.data;
  },
  
  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },
  
  removeCartItem: async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },
  
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  getOrders: async () => {
    const response = await api.get('/orders/myorders');
    return response.data;
  },
  
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, statusData) => {
    const response = await api.put(`/orders/${id}`, statusData);
    return response.data;
  },

  // Thêm API mới để cập nhật trạng thái thanh toán
  updatePaymentStatus: async (id) => {
    // API mới đã hỗ trợ toggle trạng thái, không cần tham số thêm
    const response = await api.put(`/orders/${id}/pay`);
    return response.data;
  },

  checkPaymentStatus: async (id) => {
    const response = await api.get(`/orders/${id}/payment-status`);
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  }
};

// PayOS API
export const paymentAPI = {
  // Tạo link thanh toán PayOS
  createPaymentLink: async (orderId) => {
    try {
      console.log(`API: Tạo link thanh toán cho đơn hàng ${orderId}`);
      const response = await api.post(`/payment/${orderId}/create-link`);
      return response.data;
    } catch (error) {
      console.error(`API: Lỗi khi tạo link thanh toán:`, error);
      throw error;
    }
  },

  // Kiểm tra trạng thái thanh toán
  getPaymentStatus: async (orderId) => {
    let attempts = 0;
    const maxAttempts = 2;
    
    const attempt = async () => {
      attempts++;
      try {
        console.log(`API: Kiểm tra trạng thái thanh toán cho đơn hàng ${orderId} (lần thử ${attempts}/${maxAttempts})`);
        const response = await api.get(`/payment/${orderId}/check`, { 
          timeout: 15000,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        console.log(`API: Kết quả kiểm tra trạng thái:`, response.data);
        return response.data;
      } catch (error) {
        console.error(`API: Lỗi khi kiểm tra trạng thái thanh toán (lần ${attempts}):`, error);
        
        // Thử lại nếu chưa đạt số lần tối đa
        if (attempts < maxAttempts) {
          console.log(`API: Thử lại kiểm tra lần ${attempts + 1}...`);
          // Đợi một chút trước khi thử lại
          await new Promise(resolve => setTimeout(resolve, 1000));
          return attempt(); // Thử lại
        }
        
        throw error;
      }
    };
    
    return await attempt();
  },

  // Cập nhật trạng thái thanh toán bắt buộc (khi biết đã thanh toán nhưng API không cập nhật)
  forceUpdatePaymentStatus: async (orderId) => {
    let attempts = 0;
    const maxAttempts = 3;
    
    const attempt = async () => {
      attempts++;
      try {
        console.log(`API: Đang cập nhật trạng thái thanh toán bắt buộc cho đơn hàng ${orderId} (lần thử ${attempts}/${maxAttempts})`);
        
        // Sử dụng timeout dài hơn
        const response = await api.put(`/payment/${orderId}/force-update`, null, { 
          timeout: 30000, // Tăng timeout lên 30 giây
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        console.log(`API: Kết quả cập nhật trạng thái bắt buộc:`, response.data);
        return response.data;
      } catch (error) {
        console.error(`API: Lỗi khi cập nhật trạng thái thanh toán bắt buộc (lần ${attempts}):`, error);
        
        // Thử lại nếu chưa đạt số lần tối đa
        if (attempts < maxAttempts) {
          console.log(`API: Thử lại cập nhật bắt buộc lần ${attempts + 1}...`);
          // Đợi một chút trước khi thử lại
          await new Promise(resolve => setTimeout(resolve, 1000));
          return attempt(); // Thử lại
        }
        
        throw error;
      }
    };
    
    return await attempt();
  },
  
  // Hủy link thanh toán
  cancelPaymentLink: async (orderId) => {
    try {
      console.log(`API: Hủy link thanh toán cho đơn hàng ${orderId}`);
      const response = await api.delete(`/payment/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`API: Lỗi khi hủy link thanh toán:`, error);
      throw error;
    }
  }
};

// Response interceptor for handling token expiration and other errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is a 401 and not from authentication endpoints
    const isAuthenticationError = error.response && error.response.status === 401;
    const isAuthEndpoint = error.config.url.includes('/auth/login') || 
                           error.config.url.includes('/auth/me');
    const isAlreadyOnLoginPage = window.location.pathname.includes('/login');

    // Only redirect if it's a 401 error from a non-auth endpoint and not already on login page
    if (isAuthenticationError && !isAuthEndpoint && !isAlreadyOnLoginPage) {
      console.log('Redirecting to login due to authentication error');
      // Redirect to login for expired or invalid tokens (without console error)
      setTimeout(() => {
        window.location.href = '/login';
      }, 0);
    }

    // Always allow the error to be handled by the calling method
    return Promise.reject(error);
  }
);

export default api; 