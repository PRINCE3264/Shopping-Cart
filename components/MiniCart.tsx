// "use client";

// import React, { useMemo, useState } from "react";
// import { useCart } from "./CartProvider";
// import { motion, AnimatePresence } from "motion/react";

// export default function MiniCart() {
//   const cart = useCart();
//   const [open, setOpen] = useState(false);

//   const subtotal = useMemo(() => cart.total, [cart.total]);

//   return (
//     <>
//       <div className="fixed bottom-6 right-6 z-50">
//         <button
//           onClick={() => setOpen(true)}
//           className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg"
//           aria-label="Open cart"
//         >
//           <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//             <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//           <span className="font-medium">Cart</span>
//           <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
//             {cart.count}
//           </span>
//         </button>
//       </div>

//       <AnimatePresence>
//         {open && (
//           <motion.aside
//             initial={{ x: 300, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: 300, opacity: 0 }}
//             transition={{ duration: 0.28 }}
//             className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl"
//             role="dialog"
//             aria-modal="true"
//           >
//             <div className="p-4 h-full flex flex-col">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold">Your Cart</h3>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => cart.clear()}
//                     className="text-sm text-rose-600 hover:underline"
//                   >
//                     Clear
//                   </button>
//                   <button onClick={() => setOpen(false)} aria-label="Close" className="px-2 py-1">
//                     ✕
//                   </button>
//                 </div>
//               </div>

//               <div className="mt-4 flex-1 overflow-auto">
//                 {cart.items.length === 0 ? (
//                   <div className="text-sm text-slate-500">Your cart is empty.</div>
//                 ) : (
//                   <ul className="space-y-4">
//                     {cart.items.map((it) => (
//                       <li key={it.id} className="flex items-center gap-3">
//                         <img src={it.img} alt={it.title} className="w-14 h-14 object-cover rounded" />
//                         <div className="flex-1">
//                           <div className="font-medium">{it.title}</div>
//                           <div className="text-sm text-slate-500">₹{it.price.toFixed(2)}</div>
//                           <div className="mt-2 flex items-center gap-2">
//                             <button
//                               onClick={() => cart.updateQty(it.id, it.qty - 1)}
//                               className="px-2 py-1 border rounded"
//                             >
//                               −
//                             </button>
//                             <span className="px-2">{it.qty}</span>
//                             <button
//                               onClick={() => cart.updateQty(it.id, it.qty + 1)}
//                               className="px-2 py-1 border rounded"
//                             >
//                               +
//                             </button>
//                             <button
//                               onClick={() => cart.remove(it.id)}
//                               className="ml-4 text-sm text-rose-600 hover:underline"
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>

//               <div className="mt-4 border-t pt-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="text-sm text-slate-600">Subtotal</div>
//                   <div className="font-semibold">₹{subtotal.toFixed(2)}</div>
//                 </div>
//                 <div className="flex gap-3">
//                   <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded"><Link href='/checkout'>Checkout</button>"use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";

// const CART_LS_KEY = "mysite_cart_count";

// export default function Navbar() {
//   // Start with stable server/client initial value (0) so server HTML and
//   // initial client render match exactly.
//   const [cartCount, setCartCount] = useState<number>(0);
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [isScrolled, setIsScrolled] = useState<boolean>(false);

//   // mounted indicates we've hydrated on the client.
//   const [mounted, setMounted] = useState(false);

//   // After mount read localStorage and set cart count (no reads during render)
//   useEffect(() => {
//     setMounted(true);
//     try {
//       const raw = localStorage.getItem(CART_LS_KEY);
//       const parsed = raw ? Number(raw) || 0 : 0;
//       // Only set if different to avoid extra re-render
//       if (parsed !== cartCount) setCartCount(parsed);
//     } catch (e) {
//       console.error("Error reading cart count from localStorage:", e);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // run once after mount

//   // Persist cart count when it changes
//   useEffect(() => {
//     try {
//       localStorage.setItem(CART_LS_KEY, String(cartCount));
//     } catch {
//       /* ignore */
//     }
//   }, [cartCount]);

//   // Scroll listener (client-only behavior)
//   useEffect(() => {
//     const onScroll = () => setIsScrolled(window.scrollY > 8);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     // initial check in case user loaded page scrolled
//     onScroll();
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const handleAddToCart = () => setCartCount((c) => c + 1);

//   return (
//     <header
//       aria-label="Main navigation"
//       className={`fixed w-full z-30 transition-shadow duration-300 ${
//         isScrolled ? "shadow-md bg-white/90 backdrop-blur-sm" : "bg-transparent"
//       }`}
//     >
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Top">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center gap-4">
//             <Link href="/" className="flex items-center gap-3 text-xl font-semibold" aria-label="Home">
//               <span className="inline-block w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md shadow-sm" />
//               <span className="hidden sm:inline">MyNextShop</span>
//             </Link>

//             <div className="hidden md:flex items-center gap-4" role="menubar" aria-label="Primary">
//               <Link href="/" className="hover:text-indigo-600" role="menuitem">Home</Link>
//               <Link href="/about" className="hover:text-indigo-600" role="menuitem">About</Link>
//               <Link href="/products" className="hover:text-indigo-600" role="menuitem">Product</Link>
//               <Link href="/orders" className="hover:text-indigo-600" role="menuitem">Order</Link>
//               {/* REMOVE or ADD CONTENT inside this link; empty links may cause layout differences */}
//               <Link href="/checkout" className="hover:text-indigo-600" role="menuitem">Checkout</Link>
//               <Link href="/auth/verify-otp" className="hover:text-indigo-600" role="menuitem">Verify OTP</Link>
//             </div>
//           </div>

//           <div className="hidden md:flex items-center gap-4">
//             <button
//               type="button"
//               onClick={handleAddToCart}
//               aria-label="Add to cart"
//               className="relative px-3 py-1 rounded-md border flex items-center gap-2 hover:bg-neutral-50"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
//               </svg>
//               <span className="text-sm">Add to Cart</span>

//               {/* Only render badge after client mount to guarantee server/client match.
//                   mounted is false during server render and initial client render, so
//                   server HTML and initial client render match (no badge). After hydration,
//                   effect runs, mounted becomes true and we may show the badge. */}
//               {mounted && cartCount > 0 && (
//                 <span
//                   aria-live="polite"
//                   className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full"
//                 >
//                   {cartCount}
//                 </span>
//               )}
//             </button>

//             <Link href="/auth/register" className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:opacity-95">
//               Register
//             </Link>
//           </div>

//           <div className="md:hidden flex items-center">
//             <button
//               id="mobile-menu-button"
//               type="button"
//               onClick={() => setIsOpen((s) => !s)}
//               aria-label="Toggle menu"
//               aria-expanded={isOpen}
//               className="p-2 rounded-md focus:outline-none focus:ring-2"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
//                 {isOpen ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div
//           id="mobile-menu"
//           className={`md:hidden transition-[max-height] duration-300 overflow-hidden ${isOpen ? "max-h-96" : "max-h-0"}`}
//         >
//           <div className="py-4 space-y-2">
//             <Link href="/" className="block px-2 py-2">Home</Link>
//             <Link href="/about" className="block px-2 py-2">About</Link>
//             <Link href="/products" className="block px-2 py-2">Product</Link>
//             <Link href="/orders" className="block px-2 py-2">Order</Link>
//             <Link href="/checkout" className="block px-2 py-2">Checkout</Link>
//             <Link href="/auth/verify-otp" className="block px-2 py-2">Verify OTP</Link>

//             <div className="px-2">
//               <button
//                 onClick={handleAddToCart}
//                 className="w-full text-left px-3 py-2 rounded-md border flex items-center justify-between"
//                 type="button"
//               >
//                 <span>Add to Cart</span>
//                 {mounted && cartCount > 0 ? (
//                   <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
//                     {cartCount}
//                   </span>
//                 ) : null}
//               </button>
//             </div>

//             <div className="px-2">
//               <Link href="/auth/register" className="block w-full text-center px-3 py-2 rounded-md bg-indigo-600 text-white rounded-3xl">
//                 Register
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }

//                   <button onClick={() => setOpen(false)} className="px-4 py-2 border rounded">Continue</button>
//                 </div>
//               </div>
//             </div>
//           </motion.aside>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }



"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export default function MiniCart() {
  const cart = useCart();
  const [open, setOpen] = useState(false);

  const subtotal = useMemo(() => cart.total, [cart.total]);

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg"
          aria-label="Open cart"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M3 3h2l.4 2M7 13h10l4-8H5.4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-medium">Cart</span>
          <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {cart.count}
          </span>
        </button>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="p-4 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Cart</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => cart.clear()}
                    className="text-sm text-rose-600 hover:underline"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="mt-4 flex-1 overflow-auto">
                {cart.items.length === 0 ? (
                  <div className="text-sm text-slate-500">
                    Your cart is empty.
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {cart.items.map((it) => (
                      <li key={it.id} className="flex items-center gap-3">
                        <img
                          src={it.img}
                          alt={it.title}
                          className="w-14 h-14 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{it.title}</div>
                          <div className="text-sm text-slate-500">
                            ₹{it.price.toFixed(2)}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() => cart.updateQty(it.id, it.qty - 1)}
                              className="px-2 py-1 border rounded"
                            >
                              −
                            </button>
                            <span className="px-2">{it.qty}</span>
                            <button
                              onClick={() => cart.updateQty(it.id, it.qty + 1)}
                              className="px-2 py-1 border rounded"
                            >
                              +
                            </button>
                            <button
                              onClick={() => cart.remove(it.id)}
                              className="ml-4 text-sm text-rose-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-slate-600">Subtotal</div>
                  <div className="font-semibold">
                    ₹{subtotal.toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* ✅ Fixed Link - No <a> tag */}
                  <Link
                    href="/checkout"
                    className="flex-1 block text-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                    onClick={() => setOpen(false)}
                  >
                    Checkout
                  </Link>

                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
