"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "@/components/CartProvider";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  ArrowRight,
  Grid3X3,
  List,
  X,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  Menu,
  Tally3,
  Cpu,
  Layers,
  Sparkles
} from "lucide-react";
import Image from "next/image";

/* ----- Types ----- */
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  rating: number;
  images: any;
  createdAt: string;
}

type ViewMode = "grid" | "list";
type SortOption = "newest" | "price-low" | "price-high" | "rating";

export default function ProductsPage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          if (data.length > 0) {
            const maxPrice = Math.max(...data.map((p: Product) => p.price));
            setPriceRange([0, Math.ceil(maxPrice)]);
          }
        }
      } catch (error) {
        toast.error("Archive retrieval failed");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ["All", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p =>
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === "All" || p.category === selectedCategory) &&
      (p.price >= priceRange[0] && p.price <= priceRange[1])
    );

    result.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [products, searchQuery, selectedCategory, sortBy, priceRange]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-t-4 border-indigo-600 rounded-full"
          />
          <p className="text-gray-400 font-black tracking-[0.2em] uppercase text-xs animate-pulse">Scanning Archive</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cinematic Banner */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1441984908796-9039bd922cc7?q=80&w=2070"
            alt="Banner"
            fill
            className="object-cover opacity-30 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black tracking-widest uppercase mb-8 border border-indigo-100"
          >
            <Sparkles size={12} /> THE FULL COLLECTION 2026
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-7xl md:text-[140px] font-black text-gray-900 leading-[0.8] tracking-tighter mb-8"
          >
            EXPLORE THE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-300">CATALOGUE.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-400 font-medium max-w-2xl mx-auto"
          >
            A curated archive of high-performance objects, engineered for the architectural minimalist.
          </motion.p>
        </div>

        {/* Floating elements */}
        <div className="absolute left-10 bottom-20 hidden lg:block opacity-20">
          <div className="text-[120px] font-black text-gray-100 leading-none select-none">STRUCT.</div>
        </div>
      </section>

      {/* Control Bar - Sticky Glass */}
      <div className="sticky top-20 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-2xl border border-gray-100 rounded-[32px] p-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-gray-200/40">
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto scrollbar-hide py-2 md:py-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-xl whitespace-nowrap text-[10px] font-black tracking-widest transition-all uppercase ${selectedCategory === cat
                  ? 'bg-gray-900 text-white shadow-xl shadow-gray-400'
                  : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
              <input
                type="text"
                placeholder="SPECIMEN SEARCH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-3 text-[10px] font-black tracking-widest outline-none focus:bg-white focus:ring-1 focus:ring-indigo-100 transition-all"
              />
            </div>

            <div className="flex bg-gray-50 rounded-2xl p-1 gap-1">
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>
                <LayoutGrid size={18} />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-xl transition-all ${viewMode === "list" ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>
                <List size={18} />
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-2xl transition-all flex items-center gap-2 font-black text-[10px] tracking-widest uppercase ${showFilters ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-white'}`}
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Pro Sidebar Filters - Glassmorphic */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, width: 0, x: -50 }}
                animate={{ opacity: 1, width: 320, x: 0 }}
                exit={{ opacity: 0, width: 0, x: -50 }}
                className="overflow-hidden shrink-0 space-y-12 pr-4 border-r border-gray-50"
              >
                <div className="sticky top-44 space-y-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Layers size={16} className="text-indigo-600" />
                      <h3 className="text-[10px] font-black tracking-[0.3em] text-gray-900 uppercase">Preference Layer</h3>
                    </div>
                    <div className="space-y-1">
                      {[
                        { label: "Archival Release", value: "newest" },
                        { label: "Price Ascending", value: "price-low" },
                        { label: "Price Desc", value: "price-high" },
                        { label: "Evaluation Score", value: "rating" }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSortBy(opt.value as SortOption)}
                          className={`w-full text-left px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${sortBy === opt.value ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100' : 'hover:bg-gray-50 text-gray-400'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Cpu size={16} className="text-indigo-600" />
                      <h3 className="text-[10px] font-black tracking-[0.3em] text-gray-900 uppercase">Acquisition Cap</h3>
                    </div>
                    <div className="px-2">
                      <input
                        type="range"
                        min="0"
                        max="15000"
                        step="500"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gray-900"
                      />
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Limit</span>
                        <span className="text-xl font-black text-gray-900">₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => { setSelectedCategory("All"); setSortBy("newest"); setPriceRange([0, 15000]); }}
                    className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    Reset All Nodes
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Viewport */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-24">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`group relative ${viewMode === 'list' ? 'col-span-full flex flex-col md:flex-row gap-12' : ''}`}
                  >
                    <div className={`relative bg-gray-50 rounded-[48px] overflow-hidden border border-gray-100 shadow-xs transition-all duration-700 group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] group-hover:-translate-y-4 ${viewMode === 'grid' ? 'aspect-square mb-8' : 'w-full md:w-[450px] aspect-square flex-shrink-0'}`}>
                      <Link href={`/products/${p.id}`} className="block h-full w-full">
                        <Image
                          src={Array.isArray(p.images) ? p.images[0] : (typeof p.images === 'string' ? p.images : "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=800")}
                          alt={p.name}
                          fill
                          className="object-contain p-12 group-hover:scale-110 transition-transform duration-1000 ease-out"
                        />
                      </Link>

                      <div className="absolute top-8 left-8">
                        <span className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] text-gray-900 uppercase shadow-sm border border-white/50">{p.category}</span>
                      </div>

                      <button
                        onClick={() => {
                          addToCart({ id: p.id, title: p.name, price: p.price, img: Array.isArray(p.images) ? p.images[0] : (typeof p.images === 'string' ? p.images : undefined), qty: 1 });
                          toast.success("Archived to Cart");
                        }}
                        className="absolute bottom-8 right-8 w-16 h-16 bg-gray-900 text-white rounded-[24px] flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-2xl shadow-gray-400"
                      >
                        <ShoppingCart size={24} />
                      </button>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => <Star key={i} size={11} className={i < Math.round(p.rating) ? "text-indigo-600 fill-indigo-600" : "text-gray-200"} />)}
                        </div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Scored {p.rating}</span>
                      </div>

                      <Link href={`/products/${p.id}`}>
                        <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-4 group-hover:text-indigo-600 transition-colors uppercase leading-none">{p.name}</h3>
                      </Link>

                      <p className="text-gray-400 font-medium mb-10 line-clamp-2 leading-relaxed text-sm md:text-base max-w-sm">{p.description}</p>

                      <div className="mt-auto pt-6 border-t border-gray-50 flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-gray-300 tracking-[0.3em] uppercase mb-2">Price Specification</span>
                          <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{p.price.toLocaleString()}</span>
                        </div>
                        <Link href={`/products/${p.id}`} className="text-[10px] font-black tracking-widest uppercase text-indigo-600 hover:translate-x-1 transition-transform flex items-center gap-2">
                          VIEW SPEC <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-24 text-center bg-gray-50 rounded-[64px] border border-gray-100">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-gray-100">
                  <Search size={40} className="text-gray-200" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4 uppercase">NULL ARCHIVE RESULT</h3>
                <p className="text-gray-400 font-bold max-w-sm mx-auto uppercase text-[10px] tracking-[0.3em] leading-relaxed">No specimens matching your current parameter nodes were located in the archive.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Narrative Footer Section */}
      <section className="py-40 bg-gray-900 text-white mx-6 rounded-[64px] mb-12 px-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <div className="w-full h-full grid grid-cols-12 grid-rows-12 gap-1 border border-white/10">
            {[...Array(144)].map((_, i) => <div key={i} className="border border-white/5" />)}
          </div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <span className="text-[10px] font-black tracking-[0.5em] text-indigo-500 uppercase mb-6 block">Collection Philosophy</span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12 italic uppercase">
              Objects <br /> that <br /> <span className="text-indigo-600">ENDURE.</span>
            </h2>
            <p className="text-xl text-gray-400 font-medium leading-relaxed mb-12">
              Our archival process eliminates the noise of trends, focusing purely on structural integrity and technical material superiority.
            </p>
            <Link href="/about" className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
              LEARN THE ESSENCE
            </Link>
          </div>
          <div className="hidden lg:block aspect-square relative rounded-[48px] overflow-hidden border border-white/10 p-4">
            <Image
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800"
              alt="Detail"
              fill
              className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>
        </div>
      </section>
    </div>
  );
}