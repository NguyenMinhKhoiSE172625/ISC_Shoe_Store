import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ordersAPI } from '../../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      province: '',
      postalCode: ''
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Load user data to form when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          province: '',
          postalCode: ''
        }
      });
      
      // Fetch số lượng đơn hàng từ API
      const fetchOrders = async () => {
        try {
          const response = await ordersAPI.getOrders();
          if (response && response.data) {
            setOrderCount(response.data.length);
          }
        } catch (error) {
          console.error('Lỗi khi lấy thông tin đơn hàng:', error);
          setOrderCount(0);
        }
      };
      
      fetchOrders();
    }
  }, [user]);

  // Handle change for profile form
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    // Xử lý trường hợp cập nhật thông tin địa chỉ
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prevState => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handle change for password form
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle profile update submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await updateProfile(formData);
      if (success) {
        toast.success('Thông tin cá nhân đã được cập nhật thành công!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin.');
    } finally {
      setLoading(false);
    }
  };

  // Handle password update submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      if (success) {
        toast.success('Mật khẩu đã được cập nhật thành công!');
        // Reset password form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Có lỗi xảy ra khi cập nhật mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header">
        <h1>Hồ Sơ Cá Nhân</h1>
        <p>Quản lý thông tin cá nhân và mật khẩu của bạn</p>
      </div>
      
      <div className="profile-container">
        {/* Sidebar với menu */}
        <div className="profile-sidebar">
          <ul className="profile-menu">
            <li className="profile-menu-item">
              <a 
                href="#info" 
                className={`profile-menu-link ${activeTab === 'info' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('info');
                }}
              >
                Thông Tin Cá Nhân
              </a>
            </li>
            <li className="profile-menu-item">
              <a 
                href="#password" 
                className={`profile-menu-link ${activeTab === 'password' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('password');
                }}
              >
                Đổi Mật Khẩu
              </a>
            </li>
          </ul>
        </div>
        
        {/* Nội dung chính */}
        <div className="profile-content">
          {/* Thống kê đơn giản về người dùng */}
          <div className="user-stats">
            <div className="stat-card">
              <h3>{user.name.split(' ')[0]}</h3>
              <p>Xin chào</p>
            </div>
            <div className="stat-card">
              <h3>{orderCount}</h3>
              <p>Đơn hàng</p>
            </div>
            <div className="stat-card">
              <h3>{user.role}</h3>
              <p>Vai trò</p>
            </div>
          </div>
          
          {/* Tab Thông Tin Cá Nhân */}
          {activeTab === 'info' && (
            <section className="profile-section">
              <h2>Thông Tin Cá Nhân</h2>
              <form onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Họ và Tên</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="form-control"
                    value={formData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="form-control"
                    value={formData.email}
                    onChange={handleProfileChange}
                    required
                    disabled // Email không thể thay đổi
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Số Điện Thoại</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    className="form-control"
                    value={formData.phone}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="address-section">
                  <div className="address-section-title">Thông Tin Địa Chỉ</div>
                  <div className="address-fields">
                    <div className="form-group">
                      <label htmlFor="address.street">Số nhà, Tên đường</label>
                      <input
                        type="text"
                        id="address.street" 
                        name="address.street" 
                        className="form-control"
                        placeholder="Số nhà, tên đường"
                        value={formData.address?.street || ''}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="address.city">Quận / Huyện</label>
                      <input
                        type="text"
                        id="address.city" 
                        name="address.city" 
                        className="form-control"
                        placeholder="Quận / Huyện"
                        value={formData.address?.city || ''}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="address.province">Tỉnh / Thành Phố</label>
                      <input
                        type="text"
                        id="address.province" 
                        name="address.province" 
                        className="form-control"
                        placeholder="Tỉnh / Thành Phố"
                        value={formData.address?.province || ''}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="address.postalCode">Mã Bưu Điện</label>
                      <input
                        type="text"
                        id="address.postalCode" 
                        name="address.postalCode" 
                        className="form-control"
                        placeholder="Mã Bưu Điện"
                        value={formData.address?.postalCode || ''}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Đang Cập Nhật...' : 'Cập Nhật Thông Tin'}
                </button>
              </form>
            </section>
          )}
          
          {/* Tab Đổi Mật Khẩu */}
          {activeTab === 'password' && (
            <section className="profile-section">
              <h2>Đổi Mật Khẩu</h2>
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Mật Khẩu Hiện Tại</label>
                  <input 
                    type="password" 
                    id="currentPassword" 
                    name="currentPassword" 
                    className="form-control"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">Mật Khẩu Mới</label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    name="newPassword" 
                    className="form-control"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu Mới</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    className="form-control"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Đang Cập Nhật...' : 'Đổi Mật Khẩu'}
                </button>
              </form>
            </section>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage; 