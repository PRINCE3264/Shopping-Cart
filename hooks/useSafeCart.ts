// hooks/useSafeCart.ts
"use client";

import { useCart ,CartItem } from "@/contexts/CartContext";

// Fallback implementation with proper typing
const fallbackCart = {
  cart: [] as CartItem[],
  cartCount: 0,
  addToCart: (item: Omit<CartItem, 'qty'>) => {
    // Fallback implementation using localStorage directly
    try {
      const currentCart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
      const existingItem = currentCart.find((cartItem: CartItem) => cartItem.id === item.id);
      
      let newCart;
      if (existingItem) {
        newCart = currentCart.map((cartItem: CartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      } else {
        newCart = [...currentCart, { ...item, qty: 1 }];
      }
      
      localStorage.setItem('cart_v1', JSON.stringify(newCart));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  },
  removeFromCart: (id: string) => {
    try {
      const currentCart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
      const newCart = currentCart.filter((item: CartItem) => item.id !== id);
      localStorage.setItem('cart_v1', JSON.stringify(newCart));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  },
  updateQuantity: (id: string, qty: number) => {
    try {
      const currentCart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
      const newCart = currentCart.map((item: CartItem) => 
        item.id === id ? { ...item, qty } : item
      );
      localStorage.setItem('cart_v1', JSON.stringify(newCart));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  },
  clearCart: () => {
    try {
      localStorage.setItem('cart_v1', '[]');
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }
};

export function useSafeCart() {
  try {
    return useCart();
  } catch {
    console.warn("CartProvider not available, using fallback");
    return fallbackCart;
  }
}