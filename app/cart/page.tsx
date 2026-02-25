"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();

  const subtotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const shipping = subtotal > 0 ? 49 : 0;
  const tax = +(subtotal * 0.12).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-12 shadow-inner border border-gray-100">
            <ShoppingBag className="w-16 h-16 text-gray-200" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">ARCHIVE EMPTY.</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-12">Your collection of high-performance objects is currently void.</p>
          <button
            onClick={() => router.push('/products')}
            className="px-12 py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-gray-200"
          >
            RESTOCK ARCHIVE
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-gray-100 pb-12">
          <div>
            <span className="text-xs font-black tracking-[0.4em] text-indigo-600 uppercase mb-4 block">Cart Review</span>
            <h1 className="text-6xl md:text-[80px] font-black text-gray-900 tracking-tighter leading-[0.85]">
              PENDING <br /> <span className="text-gray-300">ACQUISITIONS.</span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 px-6 py-3 border border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-all text-sm uppercase tracking-widest"
          >
            <Trash2 size={16} /> Eject All
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-12">
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group flex flex-col md:flex-row items-center gap-10 p-8 bg-gray-50 rounded-[40px] border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500"
                >
                  <div className="w-full md:w-40 h-40 bg-white rounded-3xl overflow-hidden flex items-center justify-center flex-shrink-0 border border-gray-100 shadow-sm relative group-hover:scale-105 transition-transform duration-500">
                    {item.img ? (
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="object-contain p-4"
                        sizes="160px"
                      />
                    ) : (
                      <div className="text-gray-200 text-xs font-black uppercase">Void</div>
                    )}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2 uppercase">{item.title}</h3>
                    <p className="text-xl font-black text-indigo-600">₹{item.price}</p>

                    <div className="mt-8 flex items-center justify-center md:justify-start gap-6">
                      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <button
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-black text-lg">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-12 h-12 rounded-2xl bg-white border border-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="text-center md:text-right">
                    <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Line Total</p>
                    <p className="text-4xl font-black text-gray-900">₹{(item.price * item.qty).toFixed(0)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link href="/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-all group pt-8 uppercase tracking-widest text-xs">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Continue Stocking the Archive
            </Link>
          </div>

          {/* Checkout Logic Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 text-white rounded-[48px] p-10 shadow-3xl shadow-gray-200/20 sticky top-28 overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -z-0" />

              <h3 className="text-2xl font-black tracking-tighter mb-10 border-b border-gray-800 pb-6 uppercase">Total Summary</h3>

              <div className="space-y-6 mb-12 relative z-10">
                <div className="flex justify-between items-center opacity-60">
                  <span className="text-sm font-black tracking-widest uppercase">Specimens ({cartCount})</span>
                  <span className="text-xl font-black font-mono">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center opacity-60">
                  <span className="text-sm font-black tracking-widest uppercase">Logistics Layer</span>
                  <span className="text-xl font-black font-mono">₹{shipping}</span>
                </div>
                <div className="flex justify-between items-center opacity-60">
                  <span className="text-sm font-black tracking-widest uppercase">Federal Tax (12%)</span>
                  <span className="text-xl font-black font-mono">₹{tax}</span>
                </div>
                <div className="h-[1px] bg-gray-800 my-8" />
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-gray-500 tracking-[0.3em] uppercase mb-2">Grand Total</span>
                  <span className="text-6xl font-black tracking-tight text-white font-mono">₹{total}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-white text-gray-900 py-6 rounded-2xl font-black text-lg hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-2xl shadow-indigo-500/10 flex items-center justify-center gap-3 group uppercase tracking-tighter"
              >
                AUTHORIZE ACQUISITION
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 opacity-40">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-black uppercase">Secure Port</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 opacity-40">
                  <Zap size={20} />
                  <span className="text-[10px] font-black uppercase">Instant Sync</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}