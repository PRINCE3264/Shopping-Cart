"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/components/CartProvider";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  Share2,
  Heart,
  ChevronRight,
  Globe,
  Award
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

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

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          toast.error("Specimen not found in archive");
        }
      } catch (error) {
        toast.error("Critical retrieval error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      title: product.name,
      price: product.price,
      img: productImageList[0],
      qty: quantity
    });
    toast.success(`Acquisition successful: ${product.name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-t-4 border-indigo-600 rounded-full animate-spin mb-6"></div>
        <p className="text-gray-400 font-black tracking-[0.2em] uppercase text-xs">Decoding Specimen</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Globe className="text-gray-200" size={40} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 uppercase">SPECIMEN VOID.</h1>
          <p className="text-gray-400 font-bold mb-12 uppercase tracking-widest text-xs">The requested item dose not exist in the current collection.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase">
            <ArrowLeft size={16} /> Return to archive
          </Link>
        </div>
      </div>
    );
  }

  const productImageList = Array.isArray(product.images)
    ? product.images
    : (typeof product.images === 'string' ? [product.images] : ["https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=800"]);

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Dynamic Header */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 text-xs font-black tracking-widest text-gray-400 hover:text-gray-900 transition-all uppercase mb-12 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to catalogue archive
          </Link>

          <div className="flex flex-col lg:flex-row gap-20">
            {/* Architectural Gallery */}
            <div className="w-full lg:w-1/2 space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square bg-gray-50 rounded-[60px] overflow-hidden border border-gray-100 shadow-inner group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent z-10 pointer-events-none" />
                <Image
                  src={productImageList[activeImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-12 transition-transform duration-1000 group-hover:scale-110"
                  priority
                />
                <div className="absolute top-8 right-8 z-20">
                  <button className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm">
                    <Heart size={20} />
                  </button>
                </div>
              </motion.div>

              {productImageList.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {productImageList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-24 h-24 rounded-3xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-gray-900 scale-105 shadow-xl shadow-gray-200' : 'border-gray-100 opacity-40 hover:opacity-100'}`}
                    >
                      <Image src={img} alt="" fill className="object-cover p-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specimen Specification */}
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Authentic Archival
                    </span>
                    <div className="h-[1px] flex-1 bg-gray-100" />
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.85] uppercase mb-6">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < Math.round(product.rating) ? "text-indigo-600 fill-indigo-600" : "text-gray-100"} />
                      ))}
                    </div>
                    <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Level {product.rating} Status</span>
                  </div>
                </div>

                <div className="p-10 bg-gray-50 rounded-[48px] border border-gray-100">
                  <div className="flex items-end gap-6 mb-4">
                    <span className="text-5xl font-black text-gray-900">₹{product.price}</span>
                    <span className="text-xl font-black text-gray-300 line-through mb-1">₹{(product.price * 1.5).toFixed(0)}</span>
                  </div>
                  <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Archive Discount Applied</p>
                </div>

                <p className="text-xl text-gray-500 font-medium leading-relaxed border-l-2 border-gray-100 pl-8">
                  {product.description || "Every detail of this specimen has been engineered for maximal performance and aesthetic purity. A cornerstone of the current editorial collection."}
                </p>

                <div className="pt-8 space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all text-gray-400">
                        <Minus size={18} />
                      </button>
                      <span className="w-12 text-center font-black text-2xl">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all text-gray-400">
                        <Plus size={18} />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gray-900 text-white h-20 rounded-[30px] font-black text-lg flex items-center justify-center gap-4 hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-500 shadow-2xl shadow-gray-200"
                    >
                      <ShoppingCart size={24} /> ADD TO ACQUISITION
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-8">
                    <div className="flex items-center gap-4 p-6 bg-white border border-gray-50 rounded-3xl group hover:border-indigo-100 transition-all">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase mb-1">Logistics</p>
                        <p className="text-sm font-black text-gray-900">48H EXPRESS</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-6 bg-white border border-gray-50 rounded-3xl group hover:border-indigo-100 transition-all">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Award size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase mb-1">Guaranty</p>
                        <p className="text-sm font-black text-gray-900">LIFETIME ACCESS</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Narrative Section */}
      <section className="py-32 bg-gray-50 mx-6 rounded-[60px] mt-20 px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="relative aspect-video rounded-[40px] overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1491333078588-55b6733c7de6?q=80&w=800"
              alt="Production"
              fill
              className="object-cover grayscale"
            />
            <div className="absolute inset-0 bg-indigo-600/10 mix-blend-multiply" />
          </div>
          <div>
            <span className="text-xs font-black tracking-[0.4em] text-indigo-600 uppercase mb-4 block">Manufacturing Excellence</span>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 italic uppercase leading-[0.9]">
              Engineered <br /> for <span className="text-gray-300">Permanence.</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              Utilizing next-generation sustainable textiles and precision-cut components, each piece represents the pinnacle of archival object design. Built to survive seasons and define standards.
            </p>
          </div>
        </div>
      </section>

      {/* Recommendation Engine */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16 border-b border-gray-100 pb-12">
            <div>
              <span className="text-xs font-black tracking-[0.4em] text-gray-400 uppercase mb-4 block">Archive Matches</span>
              <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase whitespace-nowrap">SIMILAR <br /> <span className="text-gray-300">OBJECTS.</span></h2>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-3 font-black text-sm uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all">
              View Complete Archive <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[3/4] bg-gray-50 rounded-[32px] overflow-hidden mb-6 border border-gray-100 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-gray-100">
                  <Image
                    src="https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=800"
                    alt="Product"
                    fill
                    className="object-contain p-8 group-hover:scale-110 transition-transform duration-1000"
                  />
                </div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors">ARCHIVAL SPECIMEN {i + 1}</h3>
                <p className="text-gray-400 font-black text-sm uppercase tracking-widest mt-1">₹{(product.price * 0.85 + i * 500).toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}