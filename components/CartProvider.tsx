
// "use client";

// import React, { createContext, useContext, useMemo, useState } from "react";

// export type CartItem = {
//   id: string | number;
//   title: string;
//   price: number;
//   img?: string;
//   qty: number;
// };

// export type CartContextValue = {
//   items: CartItem[];
//   total: number;
//   count: number;
//   // add helpers (all provided for compatibility)
//   add: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
//   addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
//   addToCart: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
//   remove: (id: string | number) => void;
//   updateQty: (id: string | number, qty: number) => void;
//   clear: () => void;
// };

// const CartContext = createContext<CartContextValue | undefined>(undefined);

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [items, setItems] = useState<CartItem[]>([]);

//   const addImpl = (payload: Omit<CartItem, "qty"> & { qty?: number }) => {
//     const id = payload.id;
//     const qtyToAdd = payload.qty && payload.qty > 0 ? Math.floor(payload.qty) : 1;

//     setItems((prev) => {
//       const existingIndex = prev.findIndex((p) => String(p.id) === String(id));
//       if (existingIndex >= 0) {
//         // increment qty
//         const copy = [...prev];
//         copy[existingIndex] = {
//           ...copy[existingIndex],
//           qty: copy[existingIndex].qty + qtyToAdd,
//         };
//         return copy;
//       }
//       // add new
//       return [
//         ...prev,
//         {
//           id,
//           title: payload.title,
//           price: payload.price,
//           img: payload.img,
//           qty: qtyToAdd,
//         },
//       ];
//     });
//   };

//   const remove = (id: string | number) =>
//     setItems((prev) => prev.filter((it) => String(it.id) !== String(id)));

//   const updateQty = (id: string | number, qty: number) =>
//     setItems((prev) =>
//       prev.map((it) =>
//         String(it.id) === String(id) ? { ...it, qty: Math.max(1, Math.floor(qty)) } : it
//       )
//     );

//   const clear = () => setItems([]);

//   const total = useMemo(
//     () => items.reduce((s, it) => s + it.price * it.qty, 0),
//     [items]
//   );

//   const count = useMemo(() => items.reduce((s, it) => s + it.qty, 0), [items]);

//   const contextValue: CartContextValue = {
//     items,
//     total,
//     count,
//     add: addImpl,
//     addItem: addImpl,
//     addToCart: addImpl,
//     remove,
//     updateQty,
//     clear,
//   };

//   return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
// };

// export const useCart = (): CartContextValue => {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used inside CartProvider");
//   return ctx;
// };
// components/CartProvider.tsx



// components/CartProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  img?: string;
  qty: number;
}

interface CartContextValue {
  // Original properties
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  
  // Additional properties for compatibility
  items: CartItem[];
  count: number;
  total: number;
  clear: () => void;
  updateQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

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
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Aliases for compatibility
  const items = cart;
  const count = cartCount;
  const clear = clearCart;
  const updateQty = updateQuantity;
  const remove = removeFromCart;

  const value: CartContextValue = {
    // Original names
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    
    // Aliases for compatibility
    items,
    count,
    total,
    clear,
    updateQty,
    remove
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}