// // components/ClientProviders.tsx
// "use client";

// import React from "react";
// import { CartProvider } from "./CartProvider";

// export default function ClientProviders({ children }: { children: React.ReactNode }) {
//   return <CartProvider>{children}</CartProvider>;
// }
// components/ClientProviders.tsx


// components/ClientProviders.tsx
"use client";

import { CartProvider } from "@/contexts/CartContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}