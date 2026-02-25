"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { User, ShoppingBag, Menu, X, LogOut, ChevronDown, Feather, Send } from "lucide-react";

const AUTH_LS_KEY = "user";
const ACCESS_TOKEN_KEY = "accessToken";

interface UserData {
  id: string;
  email: string;
  isVerified: boolean;
  name: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { cartCount } = useCart();

  // Initialize user auth status
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const rawUser = localStorage.getItem(AUTH_LS_KEY);
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

        if (rawUser && accessToken) {
          const userData: UserData = JSON.parse(rawUser);
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

    const handleStorageChange = () => initializeAuth();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(AUTH_LS_KEY);
    setIsLoggedIn(false);
    setUser(null);
    router.push('/auth/login');
  };

  const isAuthPage = pathname?.startsWith('/auth/');

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Product", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
        ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3"
        : "bg-transparent py-5"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-900">SHOPCART</span>
        </Link>

        {/* Navigation Links (Desktop) */}
        {!isAuthPage && (
          <div className="hidden lg:flex items-center gap-1 bg-gray-100/50 p-1 rounded-2xl border border-gray-200/50">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${pathname === link.path ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Cart Icon */}
          {!isAuthPage && (
            <Link
              href="/cart"
              className="relative p-2.5 bg-white border border-gray-100 rounded-xl hover:border-gray-300 transition-all group"
            >
              <ShoppingBag size={20} className="text-gray-600 group-hover:text-gray-900" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* User Auth Section */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-white border border-gray-100 rounded-2xl hover:border-gray-300 transition-all"
                >
                  <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center text-white text-xs font-black">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-gray-700">{user?.name}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-[60]">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-bold transition-all"
                    >
                      <User size={18} /> My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 font-bold transition-all mt-1"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors">Login</Link>
                <Link href="/auth/register" className="px-5 py-2.5 text-sm font-bold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">Join Us</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 bg-gray-900 text-white rounded-xl"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-white transition-all duration-500 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-16">
            <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-black">S</span>
              </div>
              <span className="text-lg font-black tracking-tighter">SHOPCART</span>
            </Link>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-4xl font-black text-gray-900 tracking-tight"
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn && (
              <Link href="/profile" onClick={() => setIsOpen(false)} className="block text-4xl font-black text-gray-900 tracking-tight">Profile</Link>
            )}
          </div>

          <div className="pt-8 border-t border-gray-100">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-lg"
              >
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="py-4 text-center font-black text-gray-900 border border-gray-200 rounded-2xl">Login</Link>
                <Link href="/auth/register" onClick={() => setIsOpen(false)} className="py-4 text-center font-black bg-gray-900 text-white rounded-2xl">Join Us</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
