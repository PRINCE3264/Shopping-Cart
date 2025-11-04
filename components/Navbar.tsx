


"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/components/CartProvider";

const AUTH_LS_KEY = "user";
const ACCESS_TOKEN_KEY = "accessToken";

interface User {
  id: string;
  email: string;
  isVerified: boolean;
  name:string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  const { cartCount, addToCart } = useCart();

  // Initialize user auth status
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const rawUser = localStorage.getItem(AUTH_LS_KEY);
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        
        if (rawUser && accessToken) {
          const userData: User = JSON.parse(rawUser);
          setUser(userData);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (e) {
        console.error("Error reading from localStorage:", e);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    initializeAuth();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      initializeAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fixed scroll listener - no synchronous state updates
  useEffect(() => {
    let ticking = false;
    
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 8);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    // Initialize scroll state after mount
    const timer = setTimeout(() => {
      setIsScrolled(window.scrollY > 8);
    }, 0);

    window.addEventListener("scroll", onScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleAddToCart = () => {
    const sampleProduct = {
      id: 'sample-product-' + Date.now(),
      title: 'Sample Product',
      price: 999,
      img: '/sample-product.jpg'
    };
    
    addToCart(sampleProduct);
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(AUTH_LS_KEY);
    setIsLoggedIn(false);
    setUser(null);
    
    // Use setTimeout to avoid React state update conflicts
    setTimeout(() => {
      router.push('/auth/login');
    }, 0);
  };


// const getUsername = (email: string | undefined | null): string => {
//   if (!email) return email || 'user';
//   return email.split('@')[0];
// };

const getUsername = (user: User | null): string => {
  if (!user) return 'User';
  return user.name || 'User'; // Use the name field directly
};

// Usage:
getUsername(user) // CORRECT: passes the user object
  const handleNavigation = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  // Don't show navigation links on auth pages
  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register';

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "shadow-lg bg-white/95 backdrop-blur-lg border-b border-gray-100" 
          : "bg-white/80 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="flex items-center gap-3 group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all duration-300">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ShoppingCart
              </span>
            </Link>

            {/* Desktop Navigation - Show all pages except on auth pages */}
            {!isAuthPage && (
              <div className="hidden lg:flex items-center gap-6">
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200"
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200"
                >
                  About
                </Link>
                <Link 
                  href="/products" 
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200"
                >
                  Products
                </Link>
                {isLoggedIn && (
                  <>
                    <Link 
                      href="/cart" 
                      className="text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200"
                    >
                      Cart {cartCount > 0 && `(${cartCount})`}
                    </Link>
                    <Link 
                      href="/checkout" 
                      className="text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200"
                    >
                      
                    </Link>
                    <Link 
                      href="/orders" 
                      className="text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200"
                    >
                      
                    </Link>
                    <Link 
                      href="/verify-email" 
                      className="text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200"
                    >
                      
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Cart Section - Only show when logged in and not on auth pages */}
            {isLoggedIn && !isAuthPage && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Add to Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center min-w-6 h-6 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </button>

                
              </div>
            )}

            {/* Auth Section */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-medium">
                        {user ? getUsername(user.name).charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Hi, {user ? getUsername(user.name) : 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl bg-gray-600 text-white font-medium hover:bg-gray-700 transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    href="/auth/login" 
                    className="px-6 py-2.5 rounded-xl border-2 border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-600 hover:text-white transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            {isLoggedIn && !isAuthPage && cartCount > 0 && (
              <Link
                href="/cart"
                className="relative p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center min-w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              </Link>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {!isAuthPage && (
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}>
            <div className="py-4 space-y-3 border-t border-gray-200">
              <Link href="/" className="block px-4 py-3 hover:bg-indigo-50 rounded-xl">Home</Link>
              <Link href="/about" className="block px-4 py-3 hover:bg-indigo-50 rounded-xl">About</Link>
              <Link href="/products" className="block px-4 py-3 hover:bg-indigo-50 rounded-xl">Products</Link>
              
              {isLoggedIn && (
                <>
                  <Link href="/cart" className="block px-4 py-3 hover:bg-indigo-50 rounded-xl">Cart ({cartCount})</Link>
                  <Link href="/checkout" className="block px-4 py-3 hover:bg-indigo-50 rounded-xl"></Link>
                  <Link href="/orders" className="block px-4 py-3 hover:bg-indigo-50 rounded-xl">Orders</Link>
                  <Link href="/verify-email" className="block px-4 py-3 hover:bg-indigo-50 rounded-xl"></Link>
                  
                  <div className="px-4 pt-2">
                    <button
                      onClick={handleAddToCart}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-indigo-200 bg-white hover:bg-indigo-50 transition-all duration-200"
                    >
                      <span className="font-medium text-gray-700">Add to Cart</span>
                      {cartCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </div>
                </>
              )}

              <div className="px-4 space-y-3 pt-2">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user ? getUsername(user.name).charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Welcome back!</p>
                          <p className="text-sm text-gray-600">{user ? getUsername(user.name) : 'User'}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 rounded-xl bg-gray-600 text-white font-medium hover:bg-gray-700 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/auth/login" className="px-4 py-3 rounded-xl border-2 border-indigo-600 text-indigo-600 text-center font-medium hover:bg-indigo-600 hover:text-white transition-all duration-200">
                      Login
                    </Link>
                    <Link href="/auth/register" className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center font-medium hover:shadow-lg transition-all duration-200">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
