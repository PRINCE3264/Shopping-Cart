// // app/products/[id]/page.tsx
// import React from "react";
// import Link from "next/link";
// import { makeProducts, Product as LibProduct } from "@/lib/products";

// /**
//  * Server component wrapper: finds product by id and renders client component
//  */
// export default function ProductPage({ params }: { params: { id: string } }) {
//   const { id } = params;
//   const products = makeProducts();
//   const product = products.find((p) => p.id === id);

//   if (!product) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-semibold mb-2">Product not found</h2>
//           <p className="text-gray-500 mb-4">We couldnt find the product you were looking for.</p>
//           <Link href="/products" className="text-indigo-600 hover:underline">Back to products</Link>
//         </div>
//       </div>
//     );
//   }

//   // Render the client component with product data
//   return <ProductDetailClient product={product} />;
// }

// /* --------------------- Client component --------------------- */
// "use client";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { useState } from "react";
// import { useCart } from "@/components/CartProvider";
// import { toast } from "react-hot-toast";

// /** Reuse the Product type from your lib (kept local type for easy editing) */
// type Product = LibProduct;

// function ProductDetailClient({ product }: { product: Product }) {
//   const { add, addToCart, addItem } = useCart() as any; // support multiple names
//   const [qty, setQty] = useState<number>(1);
//   const stars = Math.round(product.rating ?? 0);

//   const safeAdd = (payload: { id: string; title: string; price: number; img?: string; qty: number }) => {
//     const fn = typeof addToCart === "function" ? addToCart
//              : typeof add === "function" ? add
//              : typeof addItem === "function" ? addItem
//              : undefined;
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

//   const handleAddToCart = async () => {
//     safeAdd({ id: product.id, title: product.name, price: product.price, img: product.image, qty });
//     toast.success(`${product.name} added to cart`);
//     await createOrder(product.id, qty);
//   };

//   const handleBuyNow = async () => {
//     // Add to cart and immediately create order (you can adapt to redirect to checkout)
//     safeAdd({ id: product.id, title: product.name, price: product.price, img: product.image, qty });
//     toast.success(`Placing order for ${product.name}...`);
//     await createOrder(product.id, qty);
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-12">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//           {product.image ? (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img src={product.image} alt={product.name} className="w-full h-[480px] object-cover rounded-lg shadow-md" />
//           ) : (
//             <div className="w-full h-[480px] rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">No image</div>
//           )}
//         </motion.div>

//         <div>
//           <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
//           <div className="flex items-center gap-3 mb-4">
//             <div className="flex items-center gap-1">
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <svg key={i} className={`w-4 h-4 ${i < stars ? "text-yellow-400" : "text-gray-300"}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.18 3.634a1 1 0 0 0 .95.69h3.812c.969 0 1.371 1.24.588 1.81l-3.085 2.24a1 1 0 0 0-.364 1.118l1.18 3.634c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.09 2.774c-.785.57-1.84-.197-1.54-1.118l1.18-3.634a1 1 0 0 0-.364-1.118L2.102 9.06c-.783-.57-.38-1.81.588-1.81h3.812a1 1 0 0 0 .95-.69l1.18-3.634z" />
//                 </svg>
//               ))}
//             </div>
//             <div className="text-sm text-gray-500">• {product.rating ?? "—"} rating</div>
//           </div>

//           <p className="text-xl font-semibold text-indigo-600 mb-4">₹{product.price.toFixed(0)}</p>
//           <p className="text-gray-700 mb-6">{product.description}</p>

//           <div className="flex items-center gap-4 mb-6">
//             <div className="flex items-center border rounded">
//               <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">-</button>
//               <div className="px-4 py-2">{qty}</div>
//               <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2">+</button>
//             </div>

//             <div className="text-sm text-gray-500">SKU: {product.sku ?? "—"}</div>
//           </div>

//           <div className="flex gap-3">
//             <button onClick={handleAddToCart} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-md">
//               Add to Cart
//             </button>
//             <button onClick={handleBuyNow} className="border px-5 py-3 rounded-md">
//               Buy Now
//             </button>
//             <Link href="/products" className="ml-auto text-sm text-indigo-600 hover:underline self-center">Back to products</Link>
//           </div>
//         </div>
//       </div>
//     </div>

//   );
// }


// app/products/[id]/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { toast } from "react-hot-toast";
import { Star, Minus, Plus, ArrowLeft, ShoppingCart, Zap } from "lucide-react";
import { makeProducts, Product as LibProduct } from "@/lib/products";

/** Enhanced Product type with rating */
interface EnhancedProduct extends LibProduct {
  rating?: number;
  category?: string;
  inStock?: boolean;
  features?: string[];
}

function ProductDetailClient({ product }: { product: LibProduct }) {
  // Enhance product with additional data
  const enhancedProduct: EnhancedProduct = {
    ...product,
    rating: 4.5, // Default rating
    category: "Electronics", // Default category
    inStock: true,
    features: [
      "Premium quality materials",
      "Fast shipping available",
      "30-day return policy",
      "1-year warranty included"
    ]
  };

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const stars = Math.round(enhancedProduct.rating ?? 0);

  // Mock additional images for gallery
  const productImages = [
    enhancedProduct.image,
    enhancedProduct.image, // In real app, these would be different images
    enhancedProduct.image,
    enhancedProduct.image
  ].filter(Boolean) as string[];

  const handleAddToCart = async () => {
    try {
      if (addToCart) {
        addToCart({ 
          id: enhancedProduct.id, 
          title: enhancedProduct.name, 
          price: enhancedProduct.price, 
          img: enhancedProduct.image, 
          qty: quantity 
        });
        toast.success(`🎉 ${enhancedProduct.name} added to cart!`);
        
        // Attempt to create order if user is logged in
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const token = localStorage.getItem("accessToken");
        if (user?.id && token) {
          fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user: user.id, productId: enhancedProduct.id, qty: quantity }),
          }).catch(() => {
            // Silent fail - order creation is optional
          });
        }
      } else {
        toast.error("Cart functionality not available");
      }
    } catch {
      toast.error("Failed to add item to cart");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    // In a real app, you would redirect to checkout
    toast.success("Ready to checkout! Redirecting...");
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/products" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
            <div className="text-sm text-gray-500">
              Home / Products / <span className="text-gray-900">{enhancedProduct.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
              {productImages[selectedImage] ? (
                <Image
                  src={productImages[selectedImage]}
                  alt={enhancedProduct.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                    <span className="text-sm">No image available</span>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? "border-indigo-600 ring-2 ring-indigo-200" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${enhancedProduct.name} view ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category & Stock */}
            <div className="space-y-2">
              {enhancedProduct.category && (
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                  {enhancedProduct.category}
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${enhancedProduct.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {enhancedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {enhancedProduct.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= stars 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {enhancedProduct.rating?.toFixed(1)} rating
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-indigo-600 font-medium">42 reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900">
                ₹{enhancedProduct.price}
              </span>
              <span className="text-lg text-gray-500 line-through">₹{(enhancedProduct.price * 1.2).toFixed(0)}</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                20% OFF
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-gray">
              <p className="text-lg text-gray-700 leading-relaxed">
                {enhancedProduct.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Key Features</h3>
              <ul className="space-y-2">
                {enhancedProduct.features?.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={decreaseQuantity}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 text-lg font-semibold min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Only 12 left in stock
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl flex-1"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </motion.button>
              
              <motion.button
                onClick={handleBuyNow}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 bg-linear-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-colors shadow-lg hover:shadow-xl flex-1"
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </motion.button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div className="text-sm font-medium text-gray-900">Free Shipping</div>
                <div className="text-xs text-gray-500">On orders over ₹999</div>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 text-sm font-bold">↺</span>
                </div>
                <div className="text-sm font-medium text-gray-900">Easy Returns</div>
                <div className="text-xs text-gray-500">30-day return policy</div>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 text-sm font-bold">🛡️</span>
                </div>
                <div className="text-sm font-medium text-gray-900">2-Year Warranty</div>
                <div className="text-xs text-gray-500">Full protection</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/**
 * Server component wrapper: finds product by id and renders client component
 */
function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const products = makeProducts();
  const product = products.find((p) => String(p.id) === String(id));

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Product not found</h2>
          <p className="text-gray-500 mb-4">We couldn&apos;t find the product you were looking for.</p>
          <Link href="/products" className="text-indigo-600 hover:underline">Back to products</Link>
        </div>
      </div>
    );
  }

  // Render the client component with product data
  return <ProductDetailClient product={product} />;
}

export default ProductPage;