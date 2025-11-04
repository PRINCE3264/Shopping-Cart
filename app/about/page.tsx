// "use client";

// import React, { useMemo, useState } from "react";
// import Image from "next/image";
// import { useCart } from "@/components/CartProvider";

// /**
//  * About page — no jQuery, no ts-ignore, fully typed.
//  *
//  * Assumptions:
//  * - useCart() returns an object with { items, total, count, remove, updateQty, clear }
//  * - items can contain id as string | number | _id
//  *
//  * We normalize items for rendering (idStr) but keep originalId (string|number)
//  * so we call provider functions with the correct original type.
//  */

// type OriginalId = string | number;

// type RawItemShape = Record<string, unknown>;

// type NormalizedCartItem = {
//   idStr: string; // used for DOM id and key
//   originalId: OriginalId; // passed to provider functions unchanged
//   title: string;
//   price: number;
//   qty: number;
//   img?: string;
// };

// type CartContextType = {
//   items?: unknown[];
//   total: number;
//   count: number;
//   remove: (id: OriginalId) => void;
//   updateQty: (id: OriginalId, qty: number) => void;
//   clear: () => void;
// };

// export default function AboutPage(): JSX.Element {
//   // Cast useCart to a typed shape to avoid implicit any everywhere.
//   const cart = useCart() as unknown as CartContextType;
//   const { items, total, count, remove, updateQty, clear } = cart;

//   const [isProcessing, setIsProcessing] = useState(false);

//   // Normalize incoming items into a safe, strongly-typed shape for rendering.
//   const normalizedItems = useMemo<NormalizedCartItem[]>(() => {
//     const source = Array.isArray(items) ? items : [];
//     return source.map((it) => {
//       const obj = (it as RawItemShape) ?? {};
//       // Accept either id or _id, and allow number or string
//       const possibleId = obj.id ?? obj._id ?? "";
//       const originalId: OriginalId =
//         typeof possibleId === "number" || typeof possibleId === "string"
//           ? (possibleId as OriginalId)
//           : String(possibleId);

//       const idStr = String(originalId);

//       const title = typeof obj.title === "string" ? obj.title : String(obj.title ?? "Untitled");
//       const priceVal = Number(obj.price ?? 0);
//       const price = Number.isFinite(priceVal) ? priceVal : 0;

//       const qtyVal = Number(obj.qty ?? 1);
//       const qty = Number.isFinite(qtyVal) && qtyVal > 0 ? Math.floor(qtyVal) : 1;

//       const img = obj.img !== undefined && obj.img !== null ? String(obj.img) : undefined;

//       return { idStr, originalId, title, price, qty, img };
//     });
//   }, [items]);

//   // Handlers — call provider functions with originalId (keeps native type)
//   const handleRemove = (originalId: OriginalId) => {
//     setIsProcessing(true);
//     try {
//       remove(originalId);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleClear = () => {
//     setIsProcessing(true);
//     try {
//       clear();
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleUpdateQty = (originalId: OriginalId, qty: number) => {
//     const newQty = Math.max(1, Math.floor(qty));
//     updateQty(originalId, newQty);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Left: About card */}
//           <div className="md:col-span-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
//             <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
//               About Our Store
//             </h1>
//             <p className="text-gray-600">
//               This demo shows a live shopping cart powered by React Context and Next.js.
//               You can update quantities, remove items, or clear the cart. Animations are
//               done with Tailwind — no jQuery required.
//             </p>

//             <div className="mt-4 space-y-2">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-500">Items in cart</span>
//                 <span className="text-sm font-medium text-gray-700">{count}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-500">Cart total</span>
//                 <span className="text-sm font-semibold text-green-700">₹{total}</span>
//               </div>
//             </div>

//             <div className="mt-auto">
//               <button
//                 onClick={handleClear}
//                 disabled={isProcessing}
//                 className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-transform active:scale-95 disabled:opacity-50"
//               >
//                 Clear Cart
//               </button>
//             </div>
//           </div>

//           {/* Middle + Right: Cart list & summary */}
//           <div className="md:col-span-2 space-y-6">
//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <h2 className="text-lg font-semibold text-gray-800 mb-3">
//                 Your Shopping Cart <span className="text-sm text-gray-500">({count} items)</span>
//               </h2>

//               {normalizedItems.length === 0 ? (
//                 <div className="py-10 text-center text-gray-500">Your cart is empty.</div>
//               ) : (
//                 <div className="space-y-4">
//                   {normalizedItems.map((item) => (
//                     <article
//                       key={item.idStr}
//                       id={`cart-item-${item.idStr}`}
//                       className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5"
//                     >
//                       <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
//                         {item.img ? (
//                           // Next/Image: ensure external domains are allowed in next.config.js if using remote images
//                           <div className="w-full h-full relative">
//                             <Image
//                               src={item.img}
//                               alt={item.title}
//                               fill
//                               sizes="80px"
//                               style={{ objectFit: "cover" }}
//                               priority={false}
//                             />
//                           </div>
//                         ) : (
//                           <div className="text-xs text-gray-400">No image</div>
//                         )}
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <h3 className="text-sm font-semibold text-gray-900 truncate">{item.title}</h3>
//                         <p className="text-xs text-gray-500">₹{item.price.toFixed(2)}</p>

//                         <div className="mt-3 flex items-center gap-3">
//                           <button
//                             onClick={() => handleUpdateQty(item.originalId, item.qty - 1)}
//                             aria-label={`Decrease quantity of ${item.title}`}
//                             className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 active:scale-95 transition"
//                           >
//                             −
//                           </button>

//                           <div className="px-3 py-1 border rounded text-sm font-medium">
//                             {item.qty}
//                           </div>

//                           <button
//                             onClick={() => handleUpdateQty(item.originalId, item.qty + 1)}
//                             aria-label={`Increase quantity of ${item.title}`}
//                             className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 active:scale-95 transition"
//                           >
//                             +
//                           </button>
//                         </div>
//                       </div>

//                       <div className="text-right">
//                         <div className="text-sm font-semibold text-gray-800">
//                           ₹{(item.price * item.qty).toFixed(2)}
//                         </div>
//                         <button
//                           onClick={() => handleRemove(item.originalId)}
//                           disabled={isProcessing}
//                           className="text-xs text-red-600 hover:underline mt-2 disabled:opacity-50"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </article>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Summary card */}
//             <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
//               <div>
//                 <h4 className="text-sm text-gray-500">Subtotal</h4>
//                 <div className="text-2xl font-bold text-gray-900">₹{total}</div>
//               </div>

//               <div>
//                 <button
//                   disabled={normalizedItems.length === 0}
//                   className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition"
//                 >
//                   Checkout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Optional: small footer note */}
//         <div className="mt-8 text-xs text-gray-400 text-center">
//           Tip: add your payment & checkout flow to finish the demo. Use `next/image` external
//           domains configured in `next.config.js` for remote images.
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Truck, 
  Shield, 
  Star, 
  Heart, 
  Plus, 
  Minus, 
  Trash2,
  CreditCard,
  ArrowRight
} from "lucide-react";

type OriginalId = string | number;

type RawItemShape = Record<string, unknown>;

type NormalizedCartItem = {
  idStr: string;
  originalId: OriginalId;
  title: string;
  price: number;
  qty: number;
  img?: string;
};

type CartContextType = {
  items?: unknown[];
  total: number;
  count: number;
  remove: (id: OriginalId) => void;
  updateQty: (id: OriginalId, qty: number) => void;
  clear: () => void;
};

export default function AboutPage() {
  const cart = useCart() as unknown as CartContextType;
  const { items, total, count, remove, updateQty, clear } = cart;

  const [isProcessing, setIsProcessing] = useState(false);

  // Normalize cart items
  const normalizedItems = useMemo<NormalizedCartItem[]>(() => {
    const source = Array.isArray(items) ? items : [];
    return source.map((it) => {
      const obj = (it as RawItemShape) ?? {};
      const possibleId = obj.id ?? obj._id ?? "";
      const originalId: OriginalId =
        typeof possibleId === "number" || typeof possibleId === "string"
          ? (possibleId as OriginalId)
          : String(possibleId);

      const idStr = String(originalId);
      const title = typeof obj.title === "string" ? obj.title : String(obj.title ?? "Untitled");
      const priceVal = Number(obj.price ?? 0);
      const price = Number.isFinite(priceVal) ? priceVal : 0;
      const qtyVal = Number(obj.qty ?? 1);
      const qty = Number.isFinite(qtyVal) && qtyVal > 0 ? Math.floor(qtyVal) : 1;
      const img = obj.img !== undefined && obj.img !== null ? String(obj.img) : undefined;

      return { idStr, originalId, title, price, qty, img };
    });
  }, [items]);

  const handleRemove = (originalId: OriginalId) => {
    setIsProcessing(true);
    try {
      remove(originalId);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setIsProcessing(true);
    try {
      clear();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateQty = (originalId: OriginalId, qty: number) => {
    const newQty = Math.max(1, Math.floor(qty));
    updateQty(originalId, newQty);
  };

  // Mock features data
  const features = [
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "Smart Cart",
      description: "Real-time cart updates with persistent storage"
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Fast Delivery",
      description: "Free shipping on orders over ₹999"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Payments",
      description: "100% secure payment processing"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Quality Guarantee",
      description: "30-day money back guarantee"
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Our Shopping Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the future of online shopping with our innovative cart system, 
            seamless user experience, and customer-first approach.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Features Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 h-full"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Heart className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Why Choose Us</h2>
              </div>

              <div className="space-y-6 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Cart Stats */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Live Cart Demo</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Items in cart</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cart total</span>
                    <span className="font-bold text-green-600 text-lg">₹{total}</span>
                  </div>
                </div>

                <motion.button
                  onClick={handleClear}
                  disabled={isProcessing || count === 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Shopping Cart</h2>
                  <p className="text-gray-600 mt-1">
                    {count} {count === 1 ? 'item' : 'items'} in your cart
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-indigo-600" />
                </div>
              </div>

              <AnimatePresence>
                {normalizedItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600">Add some items to get started!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {normalizedItems.map((item, index) => (
                      <motion.div
                        key={item.idStr}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-6 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50/50"
                      >
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {item.img ? (
                            <div className="w-full h-full relative">
                              <Image
                                src={item.img}
                                alt={item.title}
                                fill
                                sizes="80px"
                                className="object-cover"
                                priority={false}
                              />
                            </div>
                          ) : (
                            <div className="text-gray-400 text-xs text-center px-2">
                              No image
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 mb-3">₹{item.price.toFixed(2)} each</p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <motion.button
                              onClick={() => handleUpdateQty(item.originalId, item.qty - 1)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>

                            <span className="w-12 text-center font-semibold text-gray-900">
                              {item.qty}
                            </span>

                            <motion.button
                              onClick={() => handleUpdateQty(item.originalId, item.qty + 1)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900 mb-2">
                            ₹{(item.price * item.qty).toFixed(2)}
                          </div>
                          <motion.button
                            onClick={() => handleRemove(item.originalId)}
                            disabled={isProcessing}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Checkout Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Ready to Checkout?</h3>
                  <p className="text-indigo-100 opacity-90">
                    Complete your purchase with secure payment
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold mb-2">₹{total}</div>
                  <motion.button
                    disabled={normalizedItems.length === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Built with Modern Technology</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion'].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-4 bg-gray-50 rounded-xl font-medium text-gray-700"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}