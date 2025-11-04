

// // app/page.tsx
// "use client";

// import React from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import Vortex from "@/components/ui/vortex";
// import { useCart } from "@/components/CartProvider";
// import MiniCart from "@/components/MiniCart";
// import { toast } from "react-hot-toast";

// /* ===== ProductCard Component ===== */
// function ProductCard({
//   id,
//   title,
//   price,
//   img,
//   desc,
//   rating,
// }: {
//   id: string;
//   title: string;
//   price: number;
//   img?: string;
//   desc?: string;
//   rating?: number;
// }) {
//   const { add, addToCart, addItem } = useCart(); // support multiple names
//   const stars = Math.round(rating ?? 0);

//   const callAddToCart = (payload: { id: string; title: string; price: number; img?: string; qty: number }) => {
//     const fn = typeof addToCart === "function" ? addToCart
//              : typeof add === "function" ? add
//              : typeof addItem === "function" ? addItem
//              : undefined;
//     if (fn) {
//       try {
//         fn(payload);
//       } catch (err) {
//         console.error("Cart add function threw:", err);
//       }
//     } else {
//       toast.error("Cart provider not available");
//     }
//   };

//   const createOrder = async (productId: string, qty = 1) => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user") || "null");
//       const token = localStorage.getItem("token");
//       if (!user?._id || !token) {
//         toast("Saved to cart — login to place an order", { icon: "🛒" });
//         return;
//       }

//       const res = await fetch("/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ user: user._id, productId, qty }),
//       });

//       if (res.ok) {
//         toast.success("Order created");
//       } else {
//         let data;
//         try { data = await res.json(); } catch {}
//         toast.error(data?.message || "Failed to create order");
//       }
//     } catch (err) {
//       console.error("Order API error:", err);
//       toast.error("Could not reach order API");
//     }
//   };

//   const handleAdd = async () => {
//     const payload = { id, title, price, img, qty: 1 };
//     callAddToCart(payload);
//     toast.success(`${title} added to cart`);
//     await createOrder(id, 1);
//   };

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
//       className="bg-white shadow-lg border border-gray-200 rounded-xl p-4 hover:shadow-2xl transition-all duration-300">
//       <div className="w-full h-48 overflow-hidden rounded-md mb-3">
//         {img ? (
//           // eslint-disable-next-line @next/next/no-img-element
//           <img src={img} alt={title} className="w-full h-full object-cover" />
//         ) : (
//           <div className="w-full h-full bg-gray-100 flex items-center justify-center text-sm text-gray-500">No image</div>
//         )}
//       </div>

//       <h4 className="font-semibold text-lg text-gray-900">{title}</h4>
//       <p className="text-gray-500 text-sm mt-1 mb-3 line-clamp-2">{desc}</p>

//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-1">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <svg key={i} className={`w-4 h-4 ${i < stars ? "text-yellow-400" : "text-gray-300"}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.18 3.634a1 1 0 0 0 .95.69h3.812c.969 0 1.371 1.24.588 1.81l-3.085 2.24a1 1 0 0 0-.364 1.118l1.18 3.634c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.09 2.774c-.785.57-1.84-.197-1.54-1.118l1.18-3.634a1 1 0 0 0-.364-1.118L2.102 9.06c-.783-.57-.38-1.81.588-1.81h3.812a1 1 0 0 0 .95-.69l1.18-3.634z"/>
//             </svg>
//           ))}
//         </div>
//         <span className="font-bold text-gray-900">₹{price.toFixed(0)}</span>
//       </div>

//       <button onClick={handleAdd} className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 font-medium">
//         Add to Cart
//       </button>
//     </motion.div>
//   );
// }

// /* ===== Sample Products ===== */
// const PRODUCTS = [
//   { id: "p01", title: "Aurora Tee", price: 799, img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800", desc: "Soft cotton tee.", rating: 4.6 },
//   { id: "p02", title: "Nebula Jacket", price: 2499, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800", desc: "Lightweight windbreaker.", rating: 4.8 },
//   { id: "p03", title: "Orbit Hoodie", price: 1299, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800", desc: "Cozy fleece hoodie.", rating: 4.7 },
//   { id: "p04", title: "Lunar Joggers", price: 999, img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800", desc: "Stretch joggers.", rating: 4.4 },
// ];

// function StoreContent() {
//   return (
//     <>
//       <MiniCart />
//       <div className="w-[calc(100%-4rem)] mx-auto mt-6 rounded-lg overflow-hidden h-[28rem]">
//         <Vortex backgroundColor="black" className="flex flex-col items-center justify-center px-10 py-8 w-full h-full text-white text-center">
//           <h1 className="text-5xl md:text-6xl font-bold">Welcome to MyNextShop</h1>
//           <p className="text-lg mt-4 max-w-2xl">Discover our handpicked collection of stellar styles and timeless essentials.</p>
//           <div className="flex flex-col sm:flex-row gap-4 mt-8">
//             <Link href="/products" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium text-white">Shop Now</Link>
//             <Link href="/products" className="px-6 py-3 border border-white rounded-md text-white">Explore More</Link>
//           </div>
//         </Vortex>
//       </div>

//       <section className="max-w-7xl mx-auto px-4 py-16">
//         <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-center mb-8">
//           Featured Collection
//         </motion.h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {PRODUCTS.map((p) => <ProductCard key={p.id} {...p} />)}
//         </div>

//         <div className="mt-8 text-center">
//           <Link href="/products" className="text-sm text-indigo-600 hover:underline">View all products →</Link>
//         </div>
//       </section>
//     </>
//   );
// }

// export default function HomePage() {
//   return <StoreContent />;
// }



// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Shield, Truck, ArrowRight, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import MiniCart from "@/components/MiniCart";
import { toast } from "react-hot-toast";

/* ===== Enhanced ProductCard Component ===== */
function ProductCard({
  id,
  title,
  price,
  img,
  desc,
  rating,
  category,
  isNew = false,
  isTrending = false,
}: {
  id: string;
  title: string;
  price: number;
  img?: string;
  desc?: string;
  rating?: number;
  category?: string;
  isNew?: boolean;
  isTrending?: boolean;
}) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const stars = Math.round(rating ?? 0);

  const handleAddToCart = async () => {
    try {
      addToCart({ id, title, price, img, qty: 1 });
      toast.success(`🎉 ${title} added to cart!`);
      
      // Optional: Create order if user is logged in
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = localStorage.getItem("accessToken");
      if (user?.id && token) {
        await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user: user.id, productId: id, qty: 1 }),
        });
      }
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 relative"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {isNew && (
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">NEW</span>
        )}
        {isTrending && (
          <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">TRENDING</span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100">
        <div className="aspect-square w-full">
          {img ? (
            <motion.img
              src={img}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              whileHover={{ scale: 1.1 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <span className="text-sm">No image</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
        >
          <button
            onClick={handleAddToCart}
            className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Quick Add
          </button>
          <Link
            href={`/products/${id}`}
            className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            View Details
          </Link>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        {category && (
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">{category}</span>
        )}
        <h3 className="font-bold text-lg text-gray-900 mt-1 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{desc}</p>

        {/* Rating and Price */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({rating})</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-xl text-gray-900">₹{price.toFixed(0)}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ===== Hero Carousel Component ===== */
function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Summer Collection 2024",
      subtitle: "Discover the latest trends",
      description: "Up to 50% off on selected items",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070",
      buttonText: "Shop Now",
      buttonLink: "/products?collection=summer",
      color: "from-blue-600/20 to-purple-600/20",
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Fresh styles just landed",
      description: "Be the first to explore our new collection",
      image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=2070",
      buttonText: "Explore",
      buttonLink: "/products?new=true",
      color: "from-green-600/20 to-blue-600/20",
    },
    {
      id: 3,
      title: "Limited Time Offer",
      subtitle: "Don't miss out",
      description: "Free shipping on orders over ₹1999",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070",
      buttonText: "Get Offer",
      buttonLink: "/products?offer=true",
      color: "from-orange-600/20 to-red-600/20",
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[600px] overflow-hidden rounded-3xl mx-4 mt-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image with Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].color} mix-blend-multiply`}
          />
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="max-w-2xl text-white"
              >
                <span className="text-lg font-semibold text-white/90 mb-2 block">
                  {slides[currentSlide].subtitle}
                </span>
                <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-xl mb-8 text-white/90">
                  {slides[currentSlide].description}
                </p>
                <div className="flex gap-4">
                  <Link
                    href={slides[currentSlide].buttonLink}
                    className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl"
                  >
                    {slides[currentSlide].buttonText}
                  </Link>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-white/20 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ===== Features Section ===== */
function FeaturesSection() {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Free Shipping",
      description: "Free delivery on orders over ₹1999",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payment",
      description: "100% secure payment processing",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Quality Guarantee",
      description: "30-day money back guarantee",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="text-center group"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ===== Enhanced Product Data ===== */
const ENHANCED_PRODUCTS = [
  {
    id: "p01",
    title: "Aurora Premium Tee",
    price: 799,
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800",
    desc: "Soft organic cotton tee with premium finish. Perfect for everyday wear.",
    rating: 4.6,
    category: "T-Shirts",
    isNew: true,
    isTrending: true,
  },
  {
    id: "p02",
    title: "Nebula Tech Jacket",
    price: 2499,
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800",
    desc: "Lightweight windbreaker with water-resistant technology.",
    rating: 4.8,
    category: "Jackets",
    isTrending: true,
  },
  {
    id: "p03",
    title: "Orbit Pro Hoodie",
    price: 1299,
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800",
    desc: "Cozy fleece hoodie with premium stitching and comfort fit.",
    rating: 4.7,
    category: "Hoodies",
    isNew: true,
  },
  {
    id: "p04",
    title: "Lunar Performance Joggers",
    price: 999,
    img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800",
    desc: "Stretch joggers with moisture-wicking technology.",
    rating: 4.4,
    category: "Bottoms",
  },
  {
    id: "p05",
    title: "Solar Classic Polo",
    price: 899,
    img: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=800",
    desc: "Classic fit polo shirt made from sustainable materials.",
    rating: 4.5,
    category: "Polos",
    isNew: true,
  },
  {
    id: "p06",
    title: "Galaxy Denim Jacket",
    price: 1899,
    img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800",
    desc: "Vintage wash denim jacket with modern fit.",
    rating: 4.3,
    category: "Denim",
  },
  {
    id: "p07",
    title: "Cosmic Sweatpants",
    price: 749,
    img: "data:image/jpeg;base64,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",
    desc: "Ultra-comfortable sweatpants for lounging and light activity.",
    rating: 4.2,
    category: "Bottoms",
  },
  {
    id: "p08",
    title: "Stellar Blazer",
    price: 3299,
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800",
    desc: "Professional blazer with slim fit and premium fabric.",
    rating: 4.9,
    category: "Formal",
    isTrending: true,
  },
];

function StoreContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <MiniCart />
      
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Featured Collection
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover our handpicked selection of premium products designed for modern living
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {ENHANCED_PRODUCTS.map((product, index) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All Products
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

     
      {/* <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 mt-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-4"
          >
            Stay Updated
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-indigo-100 text-lg mb-8"
          >
            Get exclusive offers and updates on new collections
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </motion.div>
        </div>
      </section>  */}
    </div>
  );
}

export default function HomePage() {
  return <StoreContent />;
}