// // contexts/CartContext.tsx
// "use client";

// import React, { createContext, useContext, useState, useEffect } from 'react';

// interface CartItem {
//   id: string;
//   title: string;
//   price: number;
//   img?: string;
//   qty: number;
// }

// interface CartContextType {
//   cart: CartItem[];
//   addToCart: (item: Omit<CartItem, 'qty'>) => void;
//   removeFromCart: (id: string) => void;
//   updateQuantity: (id: string, qty: number) => void;
//   clearCart: () => void;
//   cartCount: number;
// }

// const CartContext = createContext<CartContextType | null>(null);

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [mounted, setMounted] = useState(false);

//   // Initialize cart from localStorage
//   useEffect(() => {
//     setMounted(true);
//     try {
//       const savedCart = localStorage.getItem('cart_v1');
//       if (savedCart) {
//         setCart(JSON.parse(savedCart));
//       }
//     } catch (error) {
//       console.error('Error loading cart from localStorage:', error);
//     }
//   }, []);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     if (mounted) {
//       try {
//         localStorage.setItem('cart_v1', JSON.stringify(cart));
//       } catch (error) {
//         console.error('Error saving cart to localStorage:', error);
//       }
//     }
//   }, [cart, mounted]);

//   const addToCart = (item: Omit<CartItem, 'qty'>) => {
//     setCart(prev => {
//       const existing = prev.find(cartItem => cartItem.id === item.id);
//       if (existing) {
//         return prev.map(cartItem =>
//           cartItem.id === item.id
//             ? { ...cartItem, qty: cartItem.qty + 1 }
//             : cartItem
//         );
//       }
//       return [...prev, { ...item, qty: 1 }];
//     });
//   };

//   const removeFromCart = (id: string) => {
//     setCart(prev => prev.filter(item => item.id !== id));
//   };

//   const updateQuantity = (id: string, qty: number) => {
//     if (qty <= 0) {
//       removeFromCart(id);
//       return;
//     }
//     setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const cartCount = cart.reduce((total, item) => total + item.qty, 0);

//   return (
//     <CartContext.Provider value={{
//       cart,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       cartCount
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// }


// contexts/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  img?: string;
  qty: number;
}

export interface CartContextValue {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Initialize cart from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const savedCart = localStorage.getItem('cart_v1');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('cart_v1', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, mounted]);

  const addToCart = (item: Omit<CartItem, 'qty'>) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  const value: CartContextValue = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}