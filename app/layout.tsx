// // app/layout.tsx
// import type { ReactNode } from "react";
// import "./globals.css";
// import { CartProvider } from "@/components/CartProvider";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// export const metadata = {
//   title: "MyNextShop",
//   description: "Demo shop built with Next.js and Tailwind CSS",
// };

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="antialiased text-slate-900">
//         <CartProvider>
//           <Navbar />
//           <main className="pt-16 min-h-[70vh]">{children}</main>
//           <Footer />
//         </CartProvider>
//       </body>
//     </html>
//   );
// }





// // app/layout.tsx
// "use client";

// import type { ReactNode } from "react";
// import { useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import "./globals.css";
// import { CartProvider } from "@/components/CartProvider";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// const AUTH_LS_KEY = "user";
// const ACCESS_TOKEN_KEY = "accessToken";

// // Public routes that don't require authentication
// const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/', '/about', '/products'];

// export default function RootLayout({ children }: { children: ReactNode }) {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const checkAuth = () => {
//       try {
//         const user = localStorage.getItem(AUTH_LS_KEY);
//         const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        
//         const authenticated = !!(user && token);
//         setIsAuthenticated(authenticated);

//         // If not authenticated and trying to access protected route, redirect to login
//         if (!authenticated && !PUBLIC_ROUTES.includes(pathname)) {
//           router.push('/auth/login');
//           return;
//         }

//         // If authenticated and trying to access auth pages, redirect to home
//         if (authenticated && (pathname === '/auth/login' || pathname === '/auth/register')) {
//           router.push('/');
//         }
//       } catch (error) {
//         console.error("Auth check error:", error);
//         setIsAuthenticated(false);
//         if (!PUBLIC_ROUTES.includes(pathname)) {
//           router.push('/auth/login');
//         }
//       }
//     };

//     // Use requestAnimationFrame to avoid synchronous state updates
//     const timer = setTimeout(checkAuth, 0);
//     return () => clearTimeout(timer);
//   }, [pathname, router]);

//   // Show loading state while checking authentication
//   if (isAuthenticated === null) {
//     return (
//       <html lang="en">
//         <body className="antialiased text-slate-900">
//           <div className="min-h-screen flex items-center justify-center">
//             <div className="text-center">
//               <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//               <p className="text-gray-600">Checking authentication...</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     );
//   }

//   // Show full layout with navbar and footer for ALL pages
//   return (
//     <html lang="en">
//       <body className="antialiased text-slate-900">
//         <CartProvider>
//           <Navbar />
//           <main className="min-h-screen pt-16">
//             {children}
//           </main>
//           <Footer />
//         </CartProvider>
//       </body>
//     </html>
//   );
// }




// app/layout.tsx
"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AUTH_LS_KEY = "user";
const ACCESS_TOKEN_KEY = "accessToken";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/', '/about', '/products'];

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/checkout', '/orders', '/verify-email', '/cart'];

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = localStorage.getItem(AUTH_LS_KEY);
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        
        const authenticated = !!(user && token);
        setIsAuthenticated(authenticated);

        // If not authenticated and trying to access protected route, redirect to login
        if (!authenticated && PROTECTED_ROUTES.includes(pathname)) {
          router.push('/auth/login');
          return;
        }

        // If authenticated and trying to access auth pages, redirect to home
        if (authenticated && (pathname === '/auth/login' || pathname === '/auth/register')) {
          router.push('/');
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        if (PROTECTED_ROUTES.includes(pathname)) {
          router.push('/auth/login');
        }
      }
    };

    checkAuth();
    
    // Listen for storage changes to update auth status in real-time
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [pathname, router]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <html lang="en">
        <body className="antialiased text-slate-900">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Checking authentication...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Show full layout with navbar and footer for ALL pages
  return (
    <html lang="en">
      <body className="antialiased text-slate-900">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}