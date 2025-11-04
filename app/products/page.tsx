

// // app/products/page.tsx
// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import { useCart } from "@/components/CartProvider";
// import { toast } from "react-hot-toast";
// import { makeProducts, Product as LibProduct } from "@/lib/products";
// import MiniCart from "@/components/MiniCart";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
// import { 
//   Search, 
//   Filter, 
//   Star, 
//   ShoppingCart, 
//   Check, 
//   X, 
//   Loader2,
//   ArrowRight,
//   Grid3X3,
//   List
// } from "lucide-react";

// /* ----- Types ----- */
// interface EnhancedProduct extends LibProduct {
//   rating?: number;
//   category?: string;
// }

// type CartItemPayload = {
//   id: string;
//   title: string;
//   price: number;
//   img?: string;
//   qty: number;
// };

// type CartAddFn = (payload: CartItemPayload) => void;

// type ApiOkResult = { ok: true; data: unknown };
// type ApiErrorResult = { ok: false; message: string; code?: string; data?: unknown };
// type ApiResult = ApiOkResult | ApiErrorResult;

// type LocalOrder = {
//   id: string;
//   productId: string;
//   name: string;
//   price: number;
//   qty: number;
//   createdAt: string;
//   status?: string;
// };

// type ProductStatus = "idle" | "added" | "ordering" | "ordered" | "failed";
// type ViewMode = "grid" | "list";
// type SortOption = "name" | "price-low" | "price-high" | "rating";

// /* ----- Helpers ----- */
// const ORDERS_KEY = "orders_v1";

// function readLocalOrders(): LocalOrder[] {
//   try {
//     const raw = localStorage.getItem(ORDERS_KEY);
//     return raw ? (JSON.parse(raw) as LocalOrder[]) : [];
//   } catch {
//     return [];
//   }
// }

// function writeLocalOrders(list: LocalOrder[]) {
//   try {
//     localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
//   } catch {
//     // ignore storage errors
//   }
// }

// // Enhanced products with ratings
// function makeEnhancedProducts(): EnhancedProduct[] {
//   const baseProducts = makeProducts();
//   const ratings = [4.2, 4.5, 4.8, 4.1, 4.6, 4.3, 4.7, 4.4];
//   const categories = ["Electronics", "Clothing", "Home", "Sports", "Books", "Beauty"];
  
//   return baseProducts.map((product, index) => ({
//     ...product,
//     rating: ratings[index % ratings.length],
//     category: categories[index % categories.length]
//   }));
// }

// /* safe cart-call hook; checks multiple function names exposed by provider */
// function useCartAdd(): CartAddFn {
//   const cart = useCart() as
//     | {
//         add?: CartAddFn;
//         addToCart?: CartAddFn;
//         addItem?: CartAddFn;
//       }
//     | undefined;

//   return (payload: CartItemPayload) => {
//     const fn: CartAddFn | undefined =
//       cart && typeof cart.addToCart === "function"
//         ? cart.addToCart
//         : cart && typeof cart.add === "function"
//         ? cart.add
//         : cart && typeof cart.addItem === "function"
//         ? cart.addItem
//         : undefined;

//     if (fn) {
//       try {
//         fn(payload);
//       } catch (err) {
//         console.error("Cart add error:", err);
//         toast.error("Could not add to cart");
//       }
//     } else {
//       toast.error("Cart provider not available");
//     }
//   };
// }

// /* call backend to create order (best-effort) */
// async function createOrderApi(productId: string, qty = 1): Promise<ApiResult> {
//   try {
//     const userRaw = localStorage.getItem("user");
//     const user = userRaw ? JSON.parse(userRaw) : null;
//     const token = localStorage.getItem("accessToken");

//     if (!user?.id || !token) {
//       return { ok: false, message: "Please login to place an order", code: "NO_AUTH" };
//     }

//     const res = await fetch("/api/orders", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ user: user.id, productId, qty }),
//     });

//     if (res.ok) {
//       const data: unknown = await res.json();
//       return { ok: true, data };
//     } else {
//       let data: unknown = undefined;
//       try {
//         data = await res.json();
//       } catch {
//         // ignore parse error
//       }

//       let message = "Failed to create order";
//       if (data && typeof data === "object" && !Array.isArray(data)) {
//         const d = data as Record<string, unknown>;
//         if (typeof d.message === "string") message = d.message;
//       }

//       return { ok: false, message, code: "API_ERR", data };
//     }
//   } catch (err) {
//     console.error("Order API error:", err);
//     return { ok: false, message: "Network or server error", code: "NETWORK" };
//   }
// }

// /* ----- Product Card Components ----- */
// function ProductCardGrid({ 
//   product, 
//   status, 
//   isLoading, 
//   onAddToCart 
// }: { 
//   product: EnhancedProduct;
//   status: ProductStatus;
//   isLoading: boolean;
//   onAddToCart: (product: EnhancedProduct) => void;
// }) {
//   const [isHovered, setIsHovered] = useState(false);

//   const getButtonConfig = () => {
//     switch (status) {
//       case "ordering":
//         return { text: "Ordering...", bg: "bg-blue-600", icon: <Loader2 className="w-4 h-4 animate-spin" /> };
//       case "added":
//         return { text: "Added!", bg: "bg-green-600", icon: <Check className="w-4 h-4" /> };
//       case "ordered":
//         return { text: "Ordered!", bg: "bg-purple-600", icon: <Check className="w-4 h-4" /> };
//       case "failed":
//         return { text: "Failed", bg: "bg-red-600", icon: <X className="w-4 h-4" /> };
//       default:
//         return { text: "Add to Cart", bg: "bg-indigo-600 hover:bg-indigo-700", icon: <ShoppingCart className="w-4 h-4" /> };
//     }
//   };

//   const buttonConfig = getButtonConfig();

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -4 }}
//       transition={{ duration: 0.3 }}
//       onHoverStart={() => setIsHovered(true)}
//       onHoverEnd={() => setIsHovered(false)}
//       className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
//     >
//       {/* Image Container */}
//       <div className="relative overflow-hidden bg-gray-50">
//         <div className="aspect-square w-full">
//           {product.image ? (
//             <div className="w-full h-full relative">
//               <Image
//                 src={product.image}
//                 alt={product.name}
//                 fill
//                 className="object-cover transition-transform duration-500 group-hover:scale-105"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
//               />
//             </div>
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-gray-400">
//               <div className="text-center">
//                 <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
//                 <span className="text-sm">No image</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Quick Actions Overlay */}
//         <AnimatePresence>
//           {isHovered && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
//             >
//               <button
//                 onClick={() => onAddToCart(product)}
//                 disabled={isLoading}
//                 className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
//               >
//                 Quick Add
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Content */}
//       <div className="p-6">
//         {product.category && (
//           <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
//             {product.category}
//           </span>
//         )}
//         <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
//         <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

//         {/* Rating and Price */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-1">
//             <div className="flex">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <Star
//                   key={star}
//                   className={`w-4 h-4 ${
//                     star <= (product.rating || 0) 
//                       ? "text-yellow-400 fill-yellow-400" 
//                       : "text-gray-300"
//                   }`}
//                 />
//               ))}
//             </div>
//             <span className="text-xs text-gray-500 ml-1">({product.rating?.toFixed(1)})</span>
//           </div>
//           <div className="text-right">
//             <span className="font-bold text-xl text-gray-900">₹{product.price}</span>
//           </div>
//         </div>

//         {/* Add to Cart Button */}
//         <motion.button
//           onClick={() => onAddToCart(product)}
//           disabled={isLoading}
//           whileTap={{ scale: 0.95 }}
//           className={`w-full ${buttonConfig.bg} text-white rounded-xl py-3 font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
//         >
//           {buttonConfig.icon}
//           {buttonConfig.text}
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// }

// function ProductCardList({ 
//   product, 
//   status, 
//   isLoading, 
//   onAddToCart 
// }: { 
//   product: EnhancedProduct;
//   status: ProductStatus;
//   isLoading: boolean;
//   onAddToCart: (product: EnhancedProduct) => void;
// }) {
//   const getButtonConfig = () => {
//     switch (status) {
//       case "ordering":
//         return { text: "Ordering...", bg: "bg-blue-600", icon: <Loader2 className="w-4 h-4 animate-spin" /> };
//       case "added":
//         return { text: "Added!", bg: "bg-green-600", icon: <Check className="w-4 h-4" /> };
//       case "ordered":
//         return { text: "Ordered!", bg: "bg-purple-600", icon: <Check className="w-4 h-4" /> };
//       case "failed":
//         return { text: "Failed", bg: "bg-red-600", icon: <X className="w-4 h-4" /> };
//       default:
//         return { text: "Add to Cart", bg: "bg-indigo-600 hover:bg-indigo-700", icon: <ShoppingCart className="w-4 h-4" /> };
//     }
//   };

//   const buttonConfig = getButtonConfig();

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
//     >
//       <div className="flex gap-6">
//         {/* Image */}
//         <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-50">
//           {product.image ? (
//             <div className="w-full h-full relative">
//               <Image
//                 src={product.image}
//                 alt={product.name}
//                 fill
//                 className="object-cover"
//                 sizes="128px"
//               />
//             </div>
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
//               No image
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         <div className="flex-1 flex flex-col justify-between">
//           <div>
//             <div className="flex items-start justify-between mb-2">
//               <div>
//                 {product.category && (
//                   <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
//                     {product.category}
//                   </span>
//                 )}
//                 <h3 className="font-bold text-xl text-gray-900">{product.name}</h3>
//               </div>
//               <span className="font-bold text-2xl text-gray-900">₹{product.price}</span>
//             </div>
//             <p className="text-gray-600 mb-4">{product.description}</p>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-1">
//                 <div className="flex">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       className={`w-4 h-4 ${
//                         star <= (product.rating || 0) 
//                           ? "text-yellow-400 fill-yellow-400" 
//                           : "text-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm text-gray-500 ml-1">({product.rating?.toFixed(1)})</span>
//               </div>
//             </div>

//             <motion.button
//               onClick={() => onAddToCart(product)}
//               disabled={isLoading}
//               whileTap={{ scale: 0.95 }}
//               className={`px-6 py-3 ${buttonConfig.bg} text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]`}
//             >
//               {buttonConfig.icon}
//               {buttonConfig.text}
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// /* ----- Main Component ----- */
// export default function ProductsPage() {
//   const allProducts: EnhancedProduct[] = makeEnhancedProducts();
//   const safeAdd = useCartAdd();

//   // State management
//   const [statuses, setStatuses] = useState<Record<string, ProductStatus>>({});
//   const [loadingOrderFor, setLoadingOrderFor] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [viewMode, setViewMode] = useState<ViewMode>("grid");
//   const [sortBy, setSortBy] = useState<SortOption>("name");
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
//   const [showFilters, setShowFilters] = useState(false);

//   const idCounterRef = useRef<number>(0);

//   // Initialize statuses safely
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const initialStatuses: Record<string, ProductStatus> = {};
//       allProducts.forEach(product => {
//         initialStatuses[String(product.id)] = "idle";
//       });
//       setStatuses(initialStatuses);
//     }, 0);

//     return () => clearTimeout(timer);
//   }, [allProducts]);

//   // Filter and sort products
//   const filteredAndSortedProducts = React.useMemo(() => {
//     let filtered = allProducts.filter(product =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.description.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     // Filter by price range
//     filtered = filtered.filter(product => 
//       product.price >= priceRange[0] && product.price <= priceRange[1]
//     );

//     // Sort products
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "price-low":
//           return a.price - b.price;
//         case "price-high":
//           return b.price - a.price;
//         case "rating":
//           return (b.rating || 0) - (a.rating || 0);
//         case "name":
//         default:
//           return a.name.localeCompare(b.name);
//       }
//     });

//     return filtered;
//   }, [allProducts, searchQuery, sortBy, priceRange]);

//   const persistOrderLocally = (order: LocalOrder) => {
//     const next = [order, ...readLocalOrders()];
//     writeLocalOrders(next);
//   };

//   const setStatus = (productId: string, s: ProductStatus) =>
//     setStatuses((prev) => ({ ...prev, [productId]: s }));

//   const handleAddToCart = async (product: EnhancedProduct) => {
//     const productId = String(product.id);

//     // Optimistic UI: mark as added and add to cart context
//     setStatus(productId, "added");
//     safeAdd({ 
//       id: productId, 
//       title: product.name, 
//       price: product.price, 
//       img: product.image, 
//       qty: 1 
//     });
//     toast.success(`&quot;${product.name}&quot; added to cart!`);

//     // Open mini cart
//     window.dispatchEvent(new Event("open-mini-cart"));

//     // Attempt backend order
//     setStatus(productId, "ordering");
//     setLoadingOrderFor(productId);
//     const result = await createOrderApi(productId, 1);
//     setLoadingOrderFor(null);

//     if (!result.ok) {
//       setStatus(productId, "failed");
//       if (result.code === "NO_AUTH") {
//         toast.error("Login required to create an order. Item still saved to cart.");
//       } else {
//         toast.error(result.message || "Failed to create order");
//       }
//       setTimeout(() => setStatus(productId, "idle"), 3000);
//       return;
//     }

//     // Success - create local order
//     idCounterRef.current = idCounterRef.current + 1;
//     const localCounter = idCounterRef.current;
//     const orderId = `local-${productId}-${localCounter}`;

//     const localOrder: LocalOrder = {
//       id: orderId,
//       productId,
//       name: product.name,
//       price: product.price,
//       qty: 1,
//       createdAt: new Date().toISOString(),
//       status: "Placed",
//     };

//     persistOrderLocally(localOrder);

//     // UI success
//     setStatus(productId, "ordered");
//     toast.success(`&quot;${product.name}&quot; ordered successfully!`);

//     // Clear ordered badge
//     setTimeout(() => setStatus(productId, "idle"), 3500);
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
//       <MiniCart />
      
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             <div>
//               <h1 className="text-4xl font-bold text-gray-900">Our Products</h1>
//               <p className="text-gray-600 mt-2">
//                 Discover our amazing collection of {allProducts.length} products
//               </p>
//             </div>
            
//             <Link
//               href="/orders"
//               className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
//             >
//               View Orders
//               <ArrowRight className="w-4 h-4" />
//             </Link>
//           </div>

//           {/* Search and Controls */}
//           <div className="mt-8 flex flex-col sm:flex-row gap-4">
//             {/* Search Bar */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//             </div>

//             {/* View Mode Toggle */}
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setViewMode("grid")}
//                 className={`p-3 rounded-xl border transition-colors ${
//                   viewMode === "grid" 
//                     ? "bg-indigo-600 text-white border-indigo-600" 
//                     : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
//                 }`}
//               >
//                 <Grid3X3 className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => setViewMode("list")}
//                 className={`p-3 rounded-xl border transition-colors ${
//                   viewMode === "list" 
//                     ? "bg-indigo-600 text-white border-indigo-600" 
//                     : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
//                 }`}
//               >
//                 <List className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="p-3 rounded-xl border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
//               >
//                 <Filter className="w-5 h-5" />
//                 Filters
//               </button>
//             </div>
//           </div>

//           {/* Filters Panel */}
//           <AnimatePresence>
//             {showFilters && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="mt-4 overflow-hidden"
//               >
//                 <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Sort By */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Sort By
//                       </label>
//                       <select
//                         value={sortBy}
//                         onChange={(e) => setSortBy(e.target.value as SortOption)}
//                         className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       >
//                         <option value="name">Name</option>
//                         <option value="price-low">Price: Low to High</option>
//                         <option value="price-high">Price: High to Low</option>
//                         <option value="rating">Rating</option>
//                       </select>
//                     </div>

//                     {/* Price Range */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
//                       </label>
//                       <div className="flex items-center gap-4">
//                         <input
//                           type="range"
//                           min="0"
//                           max="5000"
//                           step="100"
//                           value={priceRange[0]}
//                           onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
//                           className="flex-1"
//                         />
//                         <input
//                           type="range"
//                           min="0"
//                           max="5000"
//                           step="100"
//                           value={priceRange[1]}
//                           onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
//                           className="flex-1"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>

//       {/* Products Grid/List */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Results Count */}
//         <div className="mb-6 text-gray-600">
//           Showing {filteredAndSortedProducts.length} of {allProducts.length} products
//           {searchQuery && (
//             <span> for &quot;<strong>{searchQuery}</strong>&quot;</span>
//           )}
//         </div>

//         {/* Products */}
//         {filteredAndSortedProducts.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="text-gray-400 text-6xl mb-4">🔍</div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
//             <p className="text-gray-600">Try adjusting your search or filters</p>
//           </div>
//         ) : (
//           <div className={
//             viewMode === "grid" 
//               ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//               : "space-y-6"
//           }>
//             <AnimatePresence mode="popLayout">
//               {filteredAndSortedProducts.map((product) => (
//                 <motion.div
//                   key={product.id}
//                   layout
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   {viewMode === "grid" ? (
//                     <ProductCardGrid
//                       product={product}
//                       status={statuses[String(product.id)] || "idle"}
//                       isLoading={loadingOrderFor === String(product.id)}
//                       onAddToCart={handleAddToCart}
//                     />
//                   ) : (
//                     <ProductCardList
//                       product={product}
//                       status={statuses[String(product.id)] || "idle"}
//                       isLoading={loadingOrderFor === String(product.id)}
//                       onAddToCart={handleAddToCart}
//                     />
//                   )}
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





// // app/products/page.tsx
// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import { useCart } from "@/components/CartProvider";
// import { toast } from "react-hot-toast";
// import { makeProducts, Product as LibProduct } from "@/lib/products";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
// import { 
//   Search, 
//   Filter, 
//   Star, 
//   ShoppingCart, 
//   Check, 
//   X, 
//   Loader2,
//   ArrowRight,
//   Grid3X3,
//   List
// } from "lucide-react";

// /* ----- Types ----- */
// interface EnhancedProduct extends LibProduct {
//   rating: number;
//   category: string;
// }

// type ProductStatus = "idle" | "added" | "ordering" | "ordered" | "failed";
// type ViewMode = "grid" | "list";
// type SortOption = "name" | "price-low" | "price-high" | "rating";

// /* ----- Helpers ----- */
// const ORDERS_KEY = "orders_v1";

// interface LocalOrder {
//   id: string;
//   productId: string;
//   name: string;
//   price: number;
//   qty: number;
//   createdAt: string;
//   status?: string;
// }

// function readLocalOrders(): LocalOrder[] {
//   try {
//     const raw = localStorage.getItem(ORDERS_KEY);
//     return raw ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// }

// function writeLocalOrders(list: LocalOrder[]) {
//   try {
//     localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
//   } catch {
//     // ignore storage errors
//   }
// }

// // Enhanced products with ratings
// function makeEnhancedProducts(): EnhancedProduct[] {
//   const baseProducts = makeProducts();
//   const ratings = [4.2, 4.5, 4.8, 4.1, 4.6, 4.3, 4.7, 4.4];
//   const categories = ["Electronics", "Clothing", "Home", "Sports", "Books", "Beauty"];
  
//   return baseProducts.map((product, index) => ({
//     ...product,
//     rating: ratings[index % ratings.length],
//     category: categories[index % categories.length]
//   }));
// }

// /* call backend to create order (best-effort) */
// async function createOrderApi(productId: string, qty = 1): Promise<{ok: boolean; message?: string; code?: string}> {
//   try {
//     const userRaw = localStorage.getItem("user");
//     const user = userRaw ? JSON.parse(userRaw) : null;
//     const token = localStorage.getItem("accessToken");

//     if (!user?.id || !token) {
//       return { ok: false, message: "Please login to place an order", code: "NO_AUTH" };
//     }

//     const res = await fetch("/api/orders", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ user: user.id, productId, qty }),
//     });

//     if (res.ok) {
//       return { ok: true };
//     } else {
//       let message = "Failed to create order";
//       try {
//         const data = await res.json();
//         if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
//           message = data.message;
//         }
//       } catch {
//         // ignore parse error
//       }
//       return { ok: false, message, code: "API_ERR" };
//     }
//   } catch (err) {
//     console.error("Order API error:", err);
//     return { ok: false, message: "Network or server error", code: "NETWORK" };
//   }
// }

// /* ----- Product Card Components ----- */
// function ProductCardGrid({ 
//   product, 
//   status, 
//   isLoading, 
//   onAddToCart 
// }: { 
//   product: EnhancedProduct;
//   status: ProductStatus;
//   isLoading: boolean;
//   onAddToCart: (product: EnhancedProduct) => void;
// }) {
//   const [isHovered, setIsHovered] = useState(false);

//   const getButtonConfig = () => {
//     switch (status) {
//       case "ordering":
//         return { text: "Ordering...", bg: "bg-blue-600", icon: <Loader2 className="w-4 h-4 animate-spin" /> };
//       case "added":
//         return { text: "Added!", bg: "bg-green-600", icon: <Check className="w-4 h-4" /> };
//       case "ordered":
//         return { text: "Ordered!", bg: "bg-purple-600", icon: <Check className="w-4 h-4" /> };
//       case "failed":
//         return { text: "Failed", bg: "bg-red-600", icon: <X className="w-4 h-4" /> };
//       default:
//         return { text: "Add to Cart", bg: "bg-indigo-600 hover:bg-indigo-700", icon: <ShoppingCart className="w-4 h-4" /> };
//     }
//   };

//   const buttonConfig = getButtonConfig();

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -4 }}
//       transition={{ duration: 0.3 }}
//       onHoverStart={() => setIsHovered(true)}
//       onHoverEnd={() => setIsHovered(false)}
//       className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
//     >
//       {/* Image Container */}
//       <div className="relative overflow-hidden bg-gray-50">
//         <div className="aspect-square w-full">
//           {product.image ? (
//             <div className="w-full h-full relative">
//               <Image
//                 src={product.image}
//                 alt={product.name}
//                 fill
//                 className="object-cover transition-transform duration-500 group-hover:scale-105"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
//               />
//             </div>
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-gray-400">
//               <div className="text-center">
//                 <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
//                 <span className="text-sm">No image</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Quick Actions Overlay */}
//         <AnimatePresence>
//           {isHovered && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
//             >
//               <button
//                 onClick={() => onAddToCart(product)}
//                 disabled={isLoading}
//                 className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
//               >
//                 Quick Add
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Content */}
//       <div className="p-6">
//         <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
//           {product.category}
//         </span>
//         <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
//         <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

//         {/* Rating and Price */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-1">
//             <div className="flex">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <Star
//                   key={star}
//                   className={`w-4 h-4 ${
//                     star <= product.rating 
//                       ? "text-yellow-400 fill-yellow-400" 
//                       : "text-gray-300"
//                   }`}
//                 />
//               ))}
//             </div>
//             <span className="text-xs text-gray-500 ml-1">({product.rating.toFixed(1)})</span>
//           </div>
//           <div className="text-right">
//             <span className="font-bold text-xl text-gray-900">₹{product.price}</span>
//           </div>
//         </div>

//         {/* Add to Cart Button */}
//         <motion.button
//           onClick={() => onAddToCart(product)}
//           disabled={isLoading}
//           whileTap={{ scale: 0.95 }}
//           className={`w-full ${buttonConfig.bg} text-white rounded-xl py-3 font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
//         >
//           {buttonConfig.icon}
//           {buttonConfig.text}
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// }

// function ProductCardList({ 
//   product, 
//   status, 
//   isLoading, 
//   onAddToCart 
// }: { 
//   product: EnhancedProduct;
//   status: ProductStatus;
//   isLoading: boolean;
//   onAddToCart: (product: EnhancedProduct) => void;
// }) {
//   const getButtonConfig = () => {
//     switch (status) {
//       case "ordering":
//         return { text: "Ordering...", bg: "bg-blue-600", icon: <Loader2 className="w-4 h-4 animate-spin" /> };
//       case "added":
//         return { text: "Added!", bg: "bg-green-600", icon: <Check className="w-4 h-4" /> };
//       case "ordered":
//         return { text: "Ordered!", bg: "bg-purple-600", icon: <Check className="w-4 h-4" /> };
//       case "failed":
//         return { text: "Failed", bg: "bg-red-600", icon: <X className="w-4 h-4" /> };
//       default:
//         return { text: "Add to Cart", bg: "bg-indigo-600 hover:bg-indigo-700", icon: <ShoppingCart className="w-4 h-4" /> };
//     }
//   };

//   const buttonConfig = getButtonConfig();

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
//     >
//       <div className="flex gap-6">
//         {/* Image */}
//         <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-50">
//           {product.image ? (
//             <div className="w-full h-full relative">
//               <Image
//                 src={product.image}
//                 alt={product.name}
//                 fill
//                 className="object-cover"
//                 sizes="128px"
//               />
//             </div>
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
//               No image
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         <div className="flex-1 flex flex-col justify-between">
//           <div>
//             <div className="flex items-start justify-between mb-2">
//               <div>
//                 <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
//                   {product.category}
//                 </span>
//                 <h3 className="font-bold text-xl text-gray-900">{product.name}</h3>
//               </div>
//               <span className="font-bold text-2xl text-gray-900">₹{product.price}</span>
//             </div>
//             <p className="text-gray-600 mb-4">{product.description}</p>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-1">
//                 <div className="flex">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       className={`w-4 h-4 ${
//                         star <= product.rating 
//                           ? "text-yellow-400 fill-yellow-400" 
//                           : "text-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm text-gray-500 ml-1">({product.rating.toFixed(1)})</span>
//               </div>
//             </div>

//             <motion.button
//               onClick={() => onAddToCart(product)}
//               disabled={isLoading}
//               whileTap={{ scale: 0.95 }}
//               className={`px-6 py-3 ${buttonConfig.bg} text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]`}
//             >
//               {buttonConfig.icon}
//               {buttonConfig.text}
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// /* ----- Main Component ----- */
// export default function ProductsPage() {
//   const allProducts: EnhancedProduct[] = makeEnhancedProducts();
//   const { addToCart } = useCart();

//   // State management
//   const [statuses, setStatuses] = useState<Record<string, ProductStatus>>({});
//   const [loadingOrderFor, setLoadingOrderFor] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [viewMode, setViewMode] = useState<ViewMode>("grid");
//   const [sortBy, setSortBy] = useState<SortOption>("name");
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
//   const [showFilters, setShowFilters] = useState(false);

//   const idCounterRef = useRef<number>(0);

//   // Initialize statuses safely
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const initialStatuses: Record<string, ProductStatus> = {};
//       allProducts.forEach(product => {
//         initialStatuses[String(product.id)] = "idle";
//       });
//       setStatuses(initialStatuses);
//     }, 0);

//     return () => clearTimeout(timer);
//   }, [allProducts]);

//   // Filter and sort products
//   const filteredAndSortedProducts = React.useMemo(() => {
//     let filtered = allProducts.filter(product =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.description.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     // Filter by price range
//     filtered = filtered.filter(product => 
//       product.price >= priceRange[0] && product.price <= priceRange[1]
//     );

//     // Sort products
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "price-low":
//           return a.price - b.price;
//         case "price-high":
//           return b.price - a.price;
//         case "rating":
//           return b.rating - a.rating;
//         case "name":
//         default:
//           return a.name.localeCompare(b.name);
//       }
//     });

//     return filtered;
//   }, [allProducts, searchQuery, sortBy, priceRange]);

//   const persistOrderLocally = (order: LocalOrder) => {
//     const next = [order, ...readLocalOrders()];
//     writeLocalOrders(next);
//   };

//   const handleAddToCart = async (product: EnhancedProduct) => {
//     const productId = String(product.id);

//     // Optimistic UI: mark as added and add to cart context
//     setStatuses(prev => ({ ...prev, [productId]: "added" }));
    
//     addToCart({ 
//       id: productId, 
//       title: product.name, 
//       price: product.price, 
//       img: product.image, 
//       qty: 1 
//     });
    
//     toast.success(`${product.name} added to cart!`);

//     // Attempt backend order
//     setStatuses(prev => ({ ...prev, [productId]: "ordering" }));
//     setLoadingOrderFor(productId);
    
//     const result = await createOrderApi(productId, 1);
//     setLoadingOrderFor(null);

//     if (!result.ok) {
//       setStatuses(prev => ({ ...prev, [productId]: "failed" }));
//       if (result.code === "NO_AUTH") {
//         toast.error("Login required to create an order. Item still saved to cart.");
//       } else {
//         toast.error(result.message || "Failed to create order");
//       }
//       setTimeout(() => setStatuses(prev => ({ ...prev, [productId]: "idle" })), 3000);
//       return;
//     }

//     // Success - create local order
//     idCounterRef.current = idCounterRef.current + 1;
//     const localCounter = idCounterRef.current;
//     const orderId = `local-${productId}-${localCounter}`;

//     const localOrder: LocalOrder = {
//       id: orderId,
//       productId,
//       name: product.name,
//       price: product.price,
//       qty: 1,
//       createdAt: new Date().toISOString(),
//       status: "Placed",
//     };

//     persistOrderLocally(localOrder);

//     // UI success
//     setStatuses(prev => ({ ...prev, [productId]: "ordered" }));
//     toast.success(`${product.name} ordered successfully!`);

//     // Clear ordered badge
//     setTimeout(() => setStatuses(prev => ({ ...prev, [productId]: "idle" })), 3500);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             <div>
//               <h1 className="text-4xl font-bold text-gray-900">Our Products</h1>
//               <p className="text-gray-600 mt-2">
//                 Discover our amazing collection of {allProducts.length} products
//               </p>
//             </div>
            
//             <Link
//               href="/orders"
//               className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
//             >
//               View Orders
//               <ArrowRight className="w-4 h-4" />
//             </Link>
//           </div>

//           {/* Search and Controls */}
//           <div className="mt-8 flex flex-col sm:flex-row gap-4">
//             {/* Search Bar */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//             </div>

//             {/* View Mode Toggle */}
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setViewMode("grid")}
//                 className={`p-3 rounded-xl border transition-colors ${
//                   viewMode === "grid" 
//                     ? "bg-indigo-600 text-white border-indigo-600" 
//                     : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
//                 }`}
//               >
//                 <Grid3X3 className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => setViewMode("list")}
//                 className={`p-3 rounded-xl border transition-colors ${
//                   viewMode === "list" 
//                     ? "bg-indigo-600 text-white border-indigo-600" 
//                     : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
//                 }`}
//               >
//                 <List className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="p-3 rounded-xl border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
//               >
//                 <Filter className="w-5 h-5" />
//                 Filters
//               </button>
//             </div>
//           </div>

//           {/* Filters Panel */}
//           <AnimatePresence>
//             {showFilters && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="mt-4 overflow-hidden"
//               >
//                 <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Sort By */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Sort By
//                       </label>
//                       <select
//                         value={sortBy}
//                         onChange={(e) => setSortBy(e.target.value as SortOption)}
//                         className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       >
//                         <option value="name">Name</option>
//                         <option value="price-low">Price: Low to High</option>
//                         <option value="price-high">Price: High to Low</option>
//                         <option value="rating">Rating</option>
//                       </select>
//                     </div>

//                     {/* Price Range */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
//                       </label>
//                       <div className="flex items-center gap-4">
//                         <input
//                           type="range"
//                           min="0"
//                           max="5000"
//                           step="100"
//                           value={priceRange[0]}
//                           onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
//                           className="flex-1"
//                         />
//                         <input
//                           type="range"
//                           min="0"
//                           max="5000"
//                           step="100"
//                           value={priceRange[1]}
//                           onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
//                           className="flex-1"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>

//       {/* Products Grid/List */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Results Count */}
//         <div className="mb-6 text-gray-600">
//           Showing {filteredAndSortedProducts.length} of {allProducts.length} products
//           {searchQuery && (
//             <span> for &quot;<strong>{searchQuery}</strong>&quot;</span>
//           )}
//         </div>

//         {/* Products */}
//         {filteredAndSortedProducts.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="text-gray-400 text-6xl mb-4">🔍</div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
//             <p className="text-gray-600">Try adjusting your search or filters</p>
//           </div>
//         ) : (
//           <div className={
//             viewMode === "grid" 
//               ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//               : "space-y-6"
//           }>
//             <AnimatePresence mode="popLayout">
//               {filteredAndSortedProducts.map((product) => (
//                 <motion.div
//                   key={product.id}
//                   layout
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   {viewMode === "grid" ? (
//                     <ProductCardGrid
//                       product={product}
//                       status={statuses[String(product.id)] || "idle"}
//                       isLoading={loadingOrderFor === String(product.id)}
//                       onAddToCart={handleAddToCart}
//                     />
//                   ) : (
//                     <ProductCardList
//                       product={product}
//                       status={statuses[String(product.id)] || "idle"}
//                       isLoading={loadingOrderFor === String(product.id)}
//                       onAddToCart={handleAddToCart}
//                     />
//                   )}
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// app/products/page.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { useCart } from "@/components/CartProvider";
import { toast } from "react-hot-toast";
import { makeProducts, Product as LibProduct } from "@/lib/products";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Check, 
  X, 
  Loader2,
  ArrowRight,
  Grid3X3,
  List
} from "lucide-react";

/* ----- Types ----- */
interface EnhancedProduct extends LibProduct {
  rating: number;
  category: string;
}

type ProductStatus = "idle" | "added" | "ordering" | "ordered" | "failed";
type ViewMode = "grid" | "list";
type SortOption = "name" | "price-low" | "price-high" | "rating";

/* ----- Helpers ----- */
const ORDERS_KEY = "orders_v1";

interface LocalOrder {
  id: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  createdAt: string;
  status?: string;
}

function readLocalOrders(): LocalOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalOrders(list: LocalOrder[]) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
}

// Enhanced products with ratings
function makeEnhancedProducts(): EnhancedProduct[] {
  const baseProducts = makeProducts();
  const ratings = [4.2, 4.5, 4.8, 4.1, 4.6, 4.3, 4.7, 4.4];
  const categories = ["Electronics", "Clothing", "Home", "Sports", "Books", "Beauty"];
  
  return baseProducts.map((product, index) => ({
    ...product,
    rating: ratings[index % ratings.length],
    category: categories[index % categories.length]
  }));
}

/* call backend to create order (best-effort) */
async function createOrderApi(productId: string, qty = 1): Promise<{ok: boolean; message?: string; code?: string}> {
  try {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const token = localStorage.getItem("accessToken");

    if (!user?.id || !token) {
      return { ok: false, message: "Please login to place an order", code: "NO_AUTH" };
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user: user.id, productId, qty }),
    });

    if (res.ok) {
      return { ok: true };
    } else {
      let message = "Failed to create order";
      try {
        const data = await res.json();
        if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
          message = data.message;
        }
      } catch {
        // ignore parse error
      }
      return { ok: false, message, code: "API_ERR" };
    }
  } catch (err) {
    console.error("Order API error:", err);
    return { ok: false, message: "Network or server error", code: "NETWORK" };
  }
}

/* ----- Product Card Components ----- */
function ProductCardGrid({ 
  product, 
  status, 
  isLoading, 
  onAddToCart 
}: { 
  product: EnhancedProduct;
  status: ProductStatus;
  isLoading: boolean;
  onAddToCart: (product: EnhancedProduct) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const getButtonConfig = () => {
    switch (status) {
      case "ordering":
        return { text: "Ordering...", bg: "bg-blue-600", icon: <Loader2 className="w-4 h-4 animate-spin" /> };
      case "added":
        return { text: "Added!", bg: "bg-green-600", icon: <Check className="w-4 h-4" /> };
      case "ordered":
        return { text: "Ordered!", bg: "bg-purple-600", icon: <Check className="w-4 h-4" /> };
      case "failed":
        return { text: "Failed", bg: "bg-red-600", icon: <X className="w-4 h-4" /> };
      default:
        return { text: "Add to Cart", bg: "bg-indigo-600 hover:bg-indigo-700", icon: <ShoppingCart className="w-4 h-4" /> };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50">
        <div className="aspect-square w-full">
          {product.image ? (
            <div className="w-full h-full relative">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>
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
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
            >
              <button
                onClick={() => onAddToCart(product)}
                disabled={isLoading}
                className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Quick Add
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-6">
        <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        {/* Rating and Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= product.rating 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.rating.toFixed(1)})</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-xl text-gray-900">₹{product.price}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={() => onAddToCart(product)}
          disabled={isLoading}
          whileTap={{ scale: 0.95 }}
          className={`w-full ${buttonConfig.bg} text-white rounded-xl py-3 font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {buttonConfig.icon}
          {buttonConfig.text}
        </motion.button>
      </div>
    </motion.div>
  );
}

function ProductCardList({ 
  product, 
  status, 
  isLoading, 
  onAddToCart 
}: { 
  product: EnhancedProduct;
  status: ProductStatus;
  isLoading: boolean;
  onAddToCart: (product: EnhancedProduct) => void;
}) {
  const getButtonConfig = () => {
    switch (status) {
      case "ordering":
        return { text: "Ordering...", bg: "bg-blue-600", icon: <Loader2 className="w-4 h-4 animate-spin" /> };
      case "added":
        return { text: "Added!", bg: "bg-green-600", icon: <Check className="w-4 h-4" /> };
      case "ordered":
        return { text: "Ordered!", bg: "bg-purple-600", icon: <Check className="w-4 h-4" /> };
      case "failed":
        return { text: "Failed", bg: "bg-red-600", icon: <X className="w-4 h-4" /> };
      default:
        return { text: "Add to Cart", bg: "bg-indigo-600 hover:bg-indigo-700", icon: <ShoppingCart className="w-4 h-4" /> };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex gap-6">
        {/* Image */}
        <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-50">
          {product.image ? (
            <div className="w-full h-full relative">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="font-bold text-xl text-gray-900">{product.name}</h3>
              </div>
              <span className="font-bold text-2xl text-gray-900">₹{product.price}</span>
            </div>
            <p className="text-gray-600 mb-4">{product.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= product.rating 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-1">({product.rating.toFixed(1)})</span>
              </div>
            </div>

            <motion.button
              onClick={() => onAddToCart(product)}
              disabled={isLoading}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 ${buttonConfig.bg} text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]`}
            >
              {buttonConfig.icon}
              {buttonConfig.text}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ----- Main Component ----- */
export default function ProductsPage() {
  const allProducts: EnhancedProduct[] = makeEnhancedProducts();
  const { addToCart } = useCart();

  // State management
  const [statuses, setStatuses] = useState<Record<string, ProductStatus>>({});
  const [loadingOrderFor, setLoadingOrderFor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  const idCounterRef = useRef<number>(0);

  // Initialize statuses safely
  useEffect(() => {
    const timer = setTimeout(() => {
      const initialStatuses: Record<string, ProductStatus> = {};
      allProducts.forEach(product => {
        initialStatuses[String(product.id)] = "idle";
      });
      setStatuses(initialStatuses);
    }, 0);

    return () => clearTimeout(timer);
  }, [allProducts]);

  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [allProducts, searchQuery, sortBy, priceRange]);

  const persistOrderLocally = (order: LocalOrder) => {
    const next = [order, ...readLocalOrders()];
    writeLocalOrders(next);
  };

  const handleAddToCart = async (product: EnhancedProduct) => {
    const productId = String(product.id);

    // Optimistic UI: mark as added and add to cart context
    setStatuses(prev => ({ ...prev, [productId]: "added" }));
    
    // ✅ FIXED: Remove qty from the payload
    addToCart({ 
      id: productId, 
      title: product.name, 
      price: product.price, 
      img: product.image
      // qty is automatically handled by the addToCart function
    });
    
    toast.success(`${product.name} added to cart!`);

    // Attempt backend order
    setStatuses(prev => ({ ...prev, [productId]: "ordering" }));
    setLoadingOrderFor(productId);
    
    const result = await createOrderApi(productId, 1);
    setLoadingOrderFor(null);

    if (!result.ok) {
      setStatuses(prev => ({ ...prev, [productId]: "failed" }));
      if (result.code === "NO_AUTH") {
        toast.error("Login required to create an order. Item still saved to cart.");
      } else {
        toast.error(result.message || "Failed to create order");
      }
      setTimeout(() => setStatuses(prev => ({ ...prev, [productId]: "idle" })), 3000);
      return;
    }

    // Success - create local order
    idCounterRef.current = idCounterRef.current + 1;
    const localCounter = idCounterRef.current;
    const orderId = `local-${productId}-${localCounter}`;

    const localOrder: LocalOrder = {
      id: orderId,
      productId,
      name: product.name,
      price: product.price,
      qty: 1,
      createdAt: new Date().toISOString(),
      status: "Placed",
    };

    persistOrderLocally(localOrder);

    // UI success
    setStatuses(prev => ({ ...prev, [productId]: "ordered" }));
    toast.success(`${product.name} ordered successfully!`);

    // Clear ordered badge
    setTimeout(() => setStatuses(prev => ({ ...prev, [productId]: "idle" })), 3500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Our Products</h1>
              <p className="text-gray-600 mt-2">
                Discover our amazing collection of {allProducts.length} products
              </p>
            </div>
            
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              View Orders
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Search and Controls */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl border transition-colors ${
                  viewMode === "grid" 
                    ? "bg-indigo-600 text-white border-indigo-600" 
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl border transition-colors ${
                  viewMode === "list" 
                    ? "bg-indigo-600 text-white border-indigo-600" 
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-3 rounded-xl border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="name">Name</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Rating</option>
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          step="100"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="flex-1"
                        />
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          step="100"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          Showing {filteredAndSortedProducts.length} of {allProducts.length} products
          {searchQuery && (
            <span> for &quot;<strong>{searchQuery}</strong>&quot;</span>
          )}
        </div>

        {/* Products */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-6"
          }>
            <AnimatePresence mode="popLayout">
              {filteredAndSortedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  {viewMode === "grid" ? (
                    <ProductCardGrid
                      product={product}
                      status={statuses[String(product.id)] || "idle"}
                      isLoading={loadingOrderFor === String(product.id)}
                      onAddToCart={handleAddToCart}
                    />
                  ) : (
                    <ProductCardList
                      product={product}
                      status={statuses[String(product.id)] || "idle"}
                      isLoading={loadingOrderFor === String(product.id)}
                      onAddToCart={handleAddToCart}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}