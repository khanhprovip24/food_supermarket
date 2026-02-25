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

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const removeItems = (ids) => {
    const idSet = new Set(ids);
    setCartItems((prev) => prev.filter((item) => !idSet.has(item.id)));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
