import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

// Create auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        setLoading(true);
        const { data } = await authAPI.getProfile();
        setUser(data);
        setIsLoggedIn(true);
      } catch (error) {
        // Clear user if not authenticated, but don't show console errors for 401s
        // as those are expected for unauthenticated users
        if (error.response?.status !== 401) {
          console.error('Error checking authentication status:', error);
        }
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      await authAPI.register(userData);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      return true;
    } catch (error) {
      console.error('Đăng ký thất bại:', error.response);
      const message = error.response?.data?.message || 
                      error.response?.data?.error || 
                      'Đăng ký thất bại. Vui lòng thử lại.';
      
      // Log chi tiết lỗi
      if (error.response) {
        // Lỗi từ phía server
        console.log('Chi tiết lỗi:', error.response.data);
        console.log('Mã trạng thái:', error.response.status);
      } else if (error.request) {
        // Lỗi không nhận được response
        console.log('Không nhận được phản hồi từ server');
      } else {
        // Lỗi khác
        console.log('Lỗi:', error.message);
      }

      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user with email and password
  const login = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await authAPI.login(credentials);
      setUser(data);
      setIsLoggedIn(true);
      toast.success('Đăng nhập thành công!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return true;
    } catch (error) {
      // Detailed error logging
      console.group('Login Error Details');
      console.error('Full Error Object:', error);
      
      if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
        console.error('Response Headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request Error:', error.request);
      } else {
        console.error('Error Message:', error.message);
      }
      console.groupEnd();
      
      let errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      
      if (error.response) {
        // More specific error messages based on status
        switch (error.response.status) {
          case 401:
            errorMessage = 'Tài khoản hoặc mật khẩu không chính xác.';
            break;
          case 403:
            errorMessage = 'Tài khoản của bạn đã bị khóa.';
            break;
          case 404:
            errorMessage = 'Không tìm thấy tài khoản.';
            break;
          case 500:
            errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
            break;
          default:
            errorMessage = error.response.data.message || 
                           error.response.data.error || 
                           errorMessage;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || 'Đã xảy ra lỗi không xác định.';
      }
      
      // Ensure toast is shown
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
      setUser(null);
      setIsLoggedIn(false);
      toast.success('Đăng xuất thành công!');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const { data } = await authAPI.updateProfile(userData);
      setUser(data);
      toast.success('Cập nhật thông tin thành công!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      setLoading(true);
      await authAPI.updatePassword(passwordData);
      toast.success('Cập nhật mật khẩu thành công!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Cập nhật mật khẩu thất bại. Vui lòng thử lại.';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        register,
        login,
        logout,
        updateProfile,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 