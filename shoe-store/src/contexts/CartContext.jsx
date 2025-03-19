import { createContext, useState, useEffect, useContext } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

// Create cart context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  // Fetch cart on login/load
  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    } else {
      // Clear cart when logged out
      setCart([]);
    }
  }, [isLoggedIn]);

  // Fetch cart items
  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await cartAPI.getCart();
      setCart(data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product) => {
    try {
      if (!isLoggedIn) {
        toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
        return;
      }

      setLoading(true);
      
      const cartItem = {
        productId: product.id || product._id,
        quantity: 1,
        size: product.selectedSize || product.sizes[0]
      };
      
      const { data } = await cartAPI.addToCart(cartItem);
      
      // Refresh cart after adding
      await fetchCart();
      
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      const message = error.response?.data?.message || 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }
      
      await cartAPI.updateCartItem(itemId, quantity);
      
      // Update local cart state
      setCart(cart.map(item => 
        item._id === itemId ? { ...item, quantity } : item
      ));
      
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Không thể cập nhật giỏ hàng. Vui lòng thử lại.');
      // Refresh cart to sync with server
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      await cartAPI.removeCartItem(itemId);
      
      // Update local cart state
      setCart(cart.filter(item => item._id !== itemId));
      
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại.');
      // Refresh cart to sync with server
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCart([]);
      toast.success('Đã xóa tất cả sản phẩm khỏi giỏ hàng!');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Không thể xóa giỏ hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Get total cart items count
  const getCartCount = () => {
    if (!cart || !Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => total + (item?.quantity || 0), 0);
  };

  // Calculate cart total
  const getCartTotal = () => {
    if (!cart || !Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => {
      if (!item || !item.product) return total;
      const price = item.product?.priceVND || (item.product?.price * 23000) || 0;
      return total + (price * (item.quantity || 0));
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartCount,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 