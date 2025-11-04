

// // app/cart/page.tsx
// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
// import Image from "next/image";
// import { useCart } from "@/contexts/CartContext";

// export default function CartPage() {
//   const router = useRouter();
//   const { cart, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();

//   const subtotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
//   const shipping = subtotal > 0 ? 49 : 0;
//   const tax = +(subtotal * 0.12).toFixed(2);
//   const total = +(subtotal + shipping + tax).toFixed(2);

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-12 px-4">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
//             <ShoppingBag className="w-16 h-16 text-gray-400" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
//           <p className="text-gray-600 mb-8">Add some products to your cart to see them here.</p>
//           <button
//             onClick={() => router.push('/products')}
//             className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
//           <button
//             onClick={clearCart}
//             className="text-red-600 hover:text-red-700 font-medium"
//           >
//             Clear All
//           </button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2 space-y-4">
//             {cart.map((item, index) => (
//               <motion.div
//                 key={item.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="bg-white rounded-2xl shadow-lg p-6"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
//                     {item.img ? (
//                       <div className="w-full h-full relative">
//                         <Image
//                           src={item.img}
//                           alt={item.title}
//                           fill
//                           className="object-cover"
//                           sizes="80px"
//                         />
//                       </div>
//                     ) : (
//                       <div className="text-gray-400 text-xs text-center">No image</div>
//                     )}
//                   </div>
                  
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
//                     <p className="text-lg font-bold text-indigo-600">₹{item.price}</p>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => updateQuantity(item.id, item.qty - 1)}
//                       className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
//                     >
//                       <Minus className="w-4 h-4" />
//                     </button>
//                     <span className="w-8 text-center font-medium">{item.qty}</span>
//                     <button
//                       onClick={() => updateQuantity(item.id, item.qty + 1)}
//                       className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
//                     >
//                       <Plus className="w-4 h-4" />
//                     </button>
//                   </div>

//                   <div className="text-right">
//                     <p className="text-lg font-bold text-gray-900">₹{(item.price * item.qty).toFixed(0)}</p>
//                     <button
//                       onClick={() => removeFromCart(item.id)}
//                       className="text-red-500 hover:text-red-700 mt-2"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Order Summary */}
//           <div className="space-y-6">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="bg-white rounded-2xl shadow-lg p-6 sticky top-6"
//             >
//               <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

//               <div className="space-y-3 border-b border-gray-200 pb-4">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Items ({cartCount})</span>
//                   <span className="text-gray-900">₹{subtotal.toFixed(0)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Shipping</span>
//                   <span className="text-gray-900">₹{shipping}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Tax (12%)</span>
//                   <span className="text-gray-900">₹{tax}</span>
//                 </div>
//               </div>

//               <div className="flex justify-between text-lg font-bold mt-4 mb-6">
//                 <span className="text-gray-900">Total</span>
//                 <span className="text-gray-900">₹{total}</span>
//               </div>

//               <button
//                 onClick={() => router.push('/checkout')}
//                 className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//               >
//                 Proceed to Checkout
//                 <ArrowRight className="w-5 h-5" />
//               </button>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// app/cart/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/components/CartProvider"; // ✅ Fixed import path

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();

  const subtotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const shipping = subtotal > 0 ? 49 : 0;
  const tax = +(subtotal * 0.12).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to your cart to see them here.</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                    {item.img ? (
                      <div className="w-full h-full relative">
                        <Image
                          src={item.img}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <div className="text-gray-400 text-xs text-center">No image</div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
                    <p className="text-lg font-bold text-indigo-600">₹{item.price}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.qty - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.qty}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.qty + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{(item.price * item.qty).toFixed(0)}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-3 border-b border-gray-200 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({cartCount})</span>
                  <span className="text-gray-900">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">₹{shipping}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (12%)</span>
                  <span className="text-gray-900">₹{tax}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mt-4 mb-6">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₹{total}</span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}