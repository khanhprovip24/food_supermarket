// import React, { createContext, useContext, useState, useEffect } from 'react';

// const CartContext = createContext();

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within CartProvider');
//   }
//   return context;
// };

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [couponCode, setCouponCode] = useState('');
//   const [discount, setDiscount] = useState(0);

//   // Load cart from localStorage on mount
//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       try {
//         setCartItems(JSON.parse(savedCart));
//       } catch (error) {
//         console.error('Error loading cart:', error);
//       }
//     }
//   }, []);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (product, quantity = 1) => {
//     setCartItems((prevItems) => {
//       const existingItem = prevItems.find((item) => item.id === product.id);
      
//       if (existingItem) {
//         return prevItems.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       }
      
//       return [...prevItems, { ...product, quantity }];
//     });
//   };

//   const removeFromCart = (productId) => {
//     setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
//   };

//   const updateQuantity = (productId, quantity) => {
//     if (quantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }
    
//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === productId ? { ...item, quantity } : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCartItems([]);
//     setCouponCode('');
//     setDiscount(0);
//   };

//   const applyCoupon = (code) => {
//     // Mock coupon validation
//     const coupons = {
//       'FRESH10': 10, // 10% discount
//       'WELCOME15': 15, // 15% discount
//       'SAVE20': 20, // 20% discount
//     };

//     const discountPercent = coupons[code.toUpperCase()];
    
//     if (discountPercent) {
//       setCouponCode(code.toUpperCase());
//       setDiscount(discountPercent);
//       return { success: true, message: `Áp dụng mã giảm ${discountPercent}% thành công!` };
//     }
    
//     return { success: false, message: 'Mã giảm giá không hợp lệ' };
//   };

//   const removeCoupon = () => {
//     setCouponCode('');
//     setDiscount(0);
//   };

//   // Calculate totals
//   const subtotal = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

//   const discountAmount = (subtotal * discount) / 100;
//   const shippingFee = subtotal > 200000 ? 0 : 30000; // Free shipping over 200k
//   const total = subtotal - discountAmount + shippingFee;

//   const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

//   const value = {
//     cartItems,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     applyCoupon,
//     removeCoupon,
//     couponCode,
//     discount,
//     subtotal,
//     discountAmount,
//     shippingFee,
//     total,
//     itemCount,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// export default CartContext;

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import cartService from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from server when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartFromServer();
    }
  }, [isAuthenticated, user]);

  // Save cart to localStorage when offline
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const loadCartFromServer = async () => {
    setLoading(true);
    const result = await cartService.getCart();
    if (result.success) {
      // API returns {success: true, cart: {...}}
      // result.data = the full response object
      const serverCart = result.data.cart || result.data;
      const items = serverCart.items || [];
      
      console.log('Loading cart from server. Items:', items);
      
      // Flatten the nested product structure
      const transformedItems = Array.isArray(items) ? items.map(item => ({
        id: item.product?.id || item.id,
        name: item.product?.name || '',
        price: item.product?.price ? parseFloat(item.product.price) : 0,
        image: item.product?.image || '',
        stock: item.product?.stock || 0,
        quantity: item.quantity || 1,
        cartItemId: item.id,
      })) : [];
      
      console.log('Transformed items:', transformedItems);
      setCartItems(transformedItems);
      setError(null);
    } else {
      console.error("Failed to load cart from server:", result.error);
      setError(result.error);
    }
    setLoading(false);
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      console.log('addToCart called with:', {productId: product.id, quantity, isAuthenticated});
      
      if (isAuthenticated) {
        // Add to server cart
        const result = await cartService.addToCart(product.id, quantity);
        console.log('addToCart result:', result);
        
        if (result.success) {
          // Reload cart from server to ensure consistency
          await loadCartFromServer();
          setError(null);
          console.log('Product added to server cart successfully');
        } else {
          setError(result.error);
          console.error('Error adding to server cart:', result.error);
        }
      } else {
        // Add to local cart when offline
        console.log('Adding to local cart (not authenticated)');
        setCartItems((prev) => {
          const existing = prev.find((item) => item.id === product.id);

          if (existing) {
            return prev.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }

          return [...prev, { ...product, quantity }];
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(err.message);
    }
  };

  const increaseQty = async (id) => {
    try {
      if (isAuthenticated) {
        // On server, we need to get current quantity and add 1
        const item = cartItems.find((item) => item.id === id);
        if (item) {
          const result = await cartService.addToCart(id, 1);
          if (result.success) {
            await loadCartFromServer();
            setError(null);
          } else {
            setError(result.error);
          }
        }
      } else {
        // Local cart
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Error increasing quantity:", err);
      setError(err.message);
    }
  };

  const decreaseQty = async (id) => {
    try {
      if (isAuthenticated) {
        // Check current quantity and decide to remove or not
        const item = cartItems.find((item) => item.id === id);
        if (item && item.quantity > 1) {
          // Ideally we'd have an update endpoint, but for now remove and re-add with qty-1
          await removeFromCart(id);
          await cartService.addToCart(id, item.quantity - 1);
          await loadCartFromServer();
          setError(null);
        } else if (item && item.quantity === 1) {
          await removeFromCart(id);
        }
      } else {
        // Local cart
        setCartItems((prev) =>
          prev
            .map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0)
        );
      }
    } catch (err) {
      console.error("Error decreasing quantity:", err);
      setError(err.message);
    }
  };

  const removeFromCart = async (id) => {
    try {
      if (isAuthenticated) {
        const result = await cartService.removeFromCart(id);
        if (result.success) {
          await loadCartFromServer();
          setError(null);
        } else {
          setError(result.error);
        }
      } else {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
      setError(err.message);
    }
  };

  const removeItems = async (ids) => {
    try {
      if (isAuthenticated) {
        // Remove multiple items from server
        for (const id of ids) {
          await cartService.removeFromCart(id);
        }
        await loadCartFromServer();
        setError(null);
      } else {
        const idSet = new Set(ids);
        setCartItems((prev) => prev.filter((item) => !idSet.has(item.id)));
      }
    } catch (err) {
      console.error("Error removing items:", err);
      setError(err.message);
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        const result = await cartService.clearCart();
        if (result.success) {
          setCartItems([]);
          setError(null);
        } else {
          setError(result.error);
        }
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError(err.message);
    }
  };

  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        removeItems,
        clearCart,
        totalItems,
        totalPrice,
        loading,
        error,
        isAuthenticated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
