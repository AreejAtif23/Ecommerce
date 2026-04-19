
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart as clearCartAPI } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await getCart();
      const items = data.cart.items.map(item => ({
        id: item._id,
        productId: item.productId._id,
        name: item.productId.name,
        price: item.price,
        quantity: item.quantity,
        image: item.productId.images[0],
        variantId: item.variantId,
        size: item.size,
        color: item.color
      }));
      setCartItems(items);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCartHandler = async (product, variantId, quantity = 1, size = '', color = '') => {
    if (!user) throw new Error('Please login to add items to cart');
    const payload = {
      productId: product._id,
      variantId: variantId,
      size,
      color,
      quantity
    };
    const { data } = await addToCart(payload);

    await fetchCart();
    return data;
  };

  const updateQuantityHandler = async (itemId, quantity) => {
    await updateCartItem(itemId, quantity);
    await fetchCart();
  };

  const removeFromCartHandler = async (itemId) => {
    await removeCartItem(itemId);
    await fetchCart();
  };

  const clearCartHandler = async () => {
    await clearCartAPI();
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart: addToCartHandler,
      removeFromCart: removeFromCartHandler,
      updateQuantity: updateQuantityHandler,
      clearCart: clearCartHandler,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
