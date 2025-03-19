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
    const response = await api.get('/orders');
    return response.data;
  },
  
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
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
      // Redirect to login for expired or invalid tokens
      window.location.href = '/login';
    }

    // Always allow the error to be handled by the calling method
    return Promise.reject(error);
  }
);

export default api; 