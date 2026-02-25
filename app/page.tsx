"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Zap,
  Globe,
  Star,
  ChevronRight,
  Play,
  ArrowUpRight
} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { toast } from "react-hot-toast";

export default function HomePage() {
  const { addToCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featuredCategories = [
    { title: "APPAREL", count: "128 Items", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800", color: "bg-orange-500" },
    { title: "ACCESSORIES", count: "84 Items", img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800", color: "bg-indigo-500" },
    { title: "FOOTWEAR", count: "56 Items", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800", color: "bg-emerald-500" },
  ];

  const trendingProducts = [
    { id: "p1", name: "Ethereal Silk Shirt", price: 4500, img: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=800", category: "Apparel" },
    { id: "p2", name: "Zenith Mineral Watch", price: 12000, img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800", category: "Acessories" },
    { id: "p3", name: "Obsidian Tech Blazer", price: 8500, img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800", category: "Formal" },
    { id: "p4", name: "Aurora Premium Tee", price: 999, img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800", category: "Apparel" },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section - Full Screen Architectural */}
      <section className="relative h-screen flex items-center px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070"
            alt="Hero Background"
            fill
            className="object-cover opacity-20 scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>

        <div className="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-xs font-black tracking-[0.5em] text-indigo-600 uppercase mb-6 block drop-shadow-sm">
                Next-Gen Digital Commerce
              </span>
              <h1 className="text-[12vw] lg:text-[150px] font-black leading-[0.8] tracking-tighter text-gray-900 mb-8 select-none">
                THE NEW <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-600 to-gray-500">LEGACY.</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-xl leading-relaxed mb-12">
                Curating high-performance objects for the modern minimalist. Redefining what it means to acquire quality.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link
                  href="/products"
                  className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-500 shadow-2xl shadow-gray-200"
                >
                  EXPLORE ARCHIVE <ArrowRight size={20} />
                </Link>
                <div className="flex items-center gap-4">
                  <button className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors group">
                    <Play size={20} className="fill-gray-900 group-hover:scale-110 transition-transform" />
                  </button>
                  <span className="font-black text-xs tracking-widest text-gray-400">WATCH THE DROP</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="hidden lg:block lg:col-span-4 aspect-[4/5] relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="h-full w-full bg-gray-50 rounded-[60px] border border-gray-100 shadow-inner overflow-hidden relative group"
            >
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800"
                alt="Featured Hero"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent flex items-end p-10">
                <div className="text-white">
                  <p className="text-xs font-black tracking-widest mb-2">COLLECTION 01</p>
                  <p className="text-2xl font-black">ETHEREAL SILK SERIES</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-200 to-transparent" />
          <span className="text-[10px] font-black tracking-widest text-gray-300">SCROLL TO DISCOVER</span>
        </motion.div>
      </section>

      {/* Categories Grid - Architectural */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <span className="text-xs font-black tracking-[0.4em] text-gray-400 uppercase mb-4 block">Categories</span>
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter">SELECT YOUR <br /> <span className="text-gray-300">DIMENSION.</span></h2>
            </div>
            <Link href="/products" className="group flex items-center gap-3 text-lg font-black text-gray-900">
              VIEW ALL COLLECTIONS <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"><ArrowRight size={20} /></div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCategories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-[600px] rounded-[40px] overflow-hidden cursor-pointer"
              >
                <Image src={cat.img} alt={cat.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
                <div className="absolute bottom-10 left-10 text-white">
                  <p className="text-sm font-black tracking-widest mb-2 opacity-60">{cat.count}</p>
                  <h3 className="text-4xl font-black tracking-tighter mb-6">{cat.title}</h3>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <ArrowUpRight size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Drop - Horizontal Scroll/Grid */}
      <section className="py-32 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-xs font-black tracking-[0.4em] text-indigo-600 uppercase mb-4 block">Weekly Drops</span>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">CURATED <span className="text-gray-300">TREASURES.</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {trendingProducts.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden mb-6 bg-white shadow-sm border border-gray-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-gray-200 group-hover:-translate-y-2">
                  <Image src={p.img} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-black rounded-lg shadow-sm">{p.category}</span>
                  </div>
                  <button
                    onClick={() => {
                      addToCart({ id: p.id, title: p.name, price: p.price, img: p.img, qty: 1 });
                      toast.success("Added to collection");
                    }}
                    className="absolute bottom-4 right-4 w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ShoppingBag size={20} />
                  </button>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">{p.name}</h3>
                <p className="text-2xl font-black text-gray-400">₹{p.price}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-4 text-xl font-black text-gray-900 group"
            >
              VIEW THE COMPLETE ARCHIVE
              <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all duration-500">
                <ArrowRight size={24} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Values - Minimalist Iconography */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-24">
          {[
            { icon: <ShieldCheck size={40} className="text-indigo-600" />, title: "SECURE CUSTODY", desc: "Every transaction is shielded by military-grade encryption systems." },
            { icon: <Zap size={40} className="text-indigo-600" />, title: "VELOCITY DELIVERED", desc: "Swift logistics network ensuring global reach within 48-72 hours." },
            { icon: <Globe size={40} className="text-indigo-600" />, title: "GLOBAL SOURCE", desc: "Materials sourced from ethical artisans across the planet's elite houses." },
          ].map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center md:text-left flex flex-col items-center md:items-start"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-8 border border-gray-100 shadow-sm">
                {v.icon}
              </div>
              <h4 className="text-xl font-black text-gray-900 tracking-tight mb-4">{v.title}</h4>
              <p className="text-gray-500 font-medium leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Architectural CTA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-[60px] p-12 md:p-32 relative overflow-hidden text-center"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 grid grid-cols-6 pointer-events-none">
                {[...Array(6)].map((_, i) => <div key={i} className="border-r border-white/20 h-full" />)}
              </div>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-12">
                BECOME PART OF <br /> THE <span className="text-indigo-500">EXPERIENCE.</span>
              </h2>
              <p className="text-xl text-gray-400 mb-12 font-medium">
                Join 50k+ members receiving exclusive early access to every drop.
              </p>
              <Link
                href="/auth/register"
                className="px-12 py-6 bg-white text-gray-900 rounded-2xl font-black text-xl hover:bg-indigo-500 hover:text-white transition-all duration-500 shadow-3xl shadow-white/5"
              >
                JOIN THE ARCHIVE
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}