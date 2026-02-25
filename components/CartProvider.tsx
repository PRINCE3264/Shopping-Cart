"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  img?: string;
  qty: number;
}

interface CartContextValue {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  total: number;
  isLoading: boolean;

  // Compatibility Aliases
  items: CartItem[];
  count: number;
  clear: () => void;
  updateQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const SESSION_KEY = "cart_sessionId";
const USER_LS_KEY = "user";

const dedupeCart = (items: CartItem[]): CartItem[] => {
  const map = new Map<string, CartItem>();
  items.forEach(item => {
    const id = String(item.id);
    if (map.has(id)) {
      const existing = map.get(id)!;
      map.set(id, { ...existing, qty: existing.qty + item.qty });
    } else {
      map.set(id, { ...item });
    }
  });
  return Array.from(map.values());
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, _setCart] = useState<CartItem[]>([]);
  const setCart = useCallback((val: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    _setCart(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      return dedupeCart(next);
    });
  }, []);

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user ID
  const getUserId = () => {
    try {
      const userRaw = localStorage.getItem(USER_LS_KEY);
      if (userRaw) {
        const user = JSON.parse(userRaw);
        return user.id;
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  // Get or create session ID
  const getSessionId = () => {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  };

  // Sync with DB
  const syncWithDb = useCallback(async (currentCart: CartItem[]) => {
    const userId = getUserId();
    const sessionId = getSessionId();

    // We only sync if we have something or we want to clear
    // For now, let's sync every change
    try {
      // In a real app, we'd debounced this
      // For each item in cart, we send a POST
      // A more efficient way would be a bulk sync API, 
      // but let's use what we have or implement one.

      // Let's just focus on the active change for now in the add/remove functions
    } catch (e) {
      console.error("Sync error:", e);
    }
  }, []);

  // Fetch initial cart from DB or LocalStorage
  useEffect(() => {
    setMounted(true);
    const initCart = async () => {
      setIsLoading(true);
      const userId = getUserId();
      const sessionId = getSessionId();

      try {
        const res = await fetch(`/api/cart?userId=${userId || ""}&sessionId=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.items) {
            const mergedItems = data.items.reduce((acc: CartItem[], it: any) => {
              const productId = it.product.id;
              const existing = acc.find(item => item.id === productId);
              if (existing) {
                existing.qty += it.qty;
              } else {
                acc.push({
                  id: productId,
                  title: it.product.name,
                  price: it.priceSnapshot,
                  img: it.product.images?.[0] || "",
                  qty: it.qty
                });
              }
              return acc;
            }, []);
            setCart(mergedItems);
          } else {
            // Fallback to localStorage if DB cart is empty
            const saved = localStorage.getItem('cart_v1');
            if (saved) setCart(JSON.parse(saved));
          }
        }
      } catch (e) {
        const saved = localStorage.getItem('cart_v1');
        if (saved) setCart(JSON.parse(saved));
      } finally {
        setIsLoading(false);
      }
    };

    initCart();
  }, []);

  // Save to LocalStorage whenever cart changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart_v1', JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const addToCart = async (item: Omit<CartItem, 'qty'>) => {
    const userId = getUserId();
    const sessionId = getSessionId();

    setCart(prev => {
      const existing = prev.find(it => it.id === item.id);
      let newCart;
      if (existing) {
        newCart = prev.map(it => it.id === item.id ? { ...it, qty: it.qty + 1 } : it);
      } else {
        newCart = [...prev, { ...item, qty: 1 }];
      }

      // Async update DB
      const targetQty = existing ? existing.qty + 1 : 1;
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, sessionId, productId: item.id, qty: targetQty })
      });

      return newCart;
    });

    toast.success(`${item.title} added to cart`);
  };

  const removeFromCart = (id: string) => {
    const userId = getUserId();
    const sessionId = getSessionId();

    setCart(prev => {
      const item = prev.find(it => it.id === id);
      if (item) {
        fetch(`/api/cart?userId=${userId || ""}&sessionId=${sessionId}&productId=${id}`, {
          method: "DELETE"
        });
      }
      return prev.filter(it => it.id !== id);
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }

    const userId = getUserId();
    const sessionId = getSessionId();

    setCart(prev => {
      const updated = prev.map(it => it.id === id ? { ...it, qty } : it);

      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, sessionId, productId: id, qty })
      });

      return updated;
    });
  };

  const clearCart = () => {
    const userId = getUserId();
    const sessionId = getSessionId();

    setCart([]);
    fetch(`/api/cart?userId=${userId || ""}&sessionId=${sessionId}`, {
      method: "DELETE"
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const value: CartContextValue = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    total,
    isLoading,

    // Aliases
    items: cart,
    count: cartCount,
    clear: clearCart,
    updateQty: updateQuantity,
    remove: removeFromCart
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