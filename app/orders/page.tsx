
// // app/auth/order/page.tsx
// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import Link from "next/link";
// import { useSearchParams, useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   ArrowLeft, 
//   RefreshCw, 
//   Package, 
//   Truck, 
//   CheckCircle, 
//   Clock,
//   Search,
//   Filter,
//   X
// } from "lucide-react";

// type LocalOrder = {
//   id: string;
//   productId: string;
//   name: string;
//   price: number;
//   qty: number;
//   createdAt: string;
//   status?: string;
// };

// const ORDERS_KEY = "orders_v1";

// /** Safe read orders from storage */
// function readLocalOrders(): LocalOrder[] {
//   try {
//     const raw = typeof window !== "undefined" ? localStorage.getItem(ORDERS_KEY) ?? localStorage.getItem("orders") : null;
//     return raw ? (JSON.parse(raw) as LocalOrder[]) : [];
//   } catch {
//     return [];
//   }
// }

// /** Component */
// export default function OrdersPage() {
//   const [orders, setOrders] = useState<LocalOrder[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");

//   const search = useSearchParams();
//   const router = useRouter();
//   const orderId = search?.get("id") ?? null;

//   // Load orders on component mount
//   useEffect(() => {
//     const loadOrders = () => {
//       setIsLoading(true);
//       try {
//         const loadedOrders = readLocalOrders();
//         setOrders(loadedOrders);
//       } catch (error) {
//         console.error("Error loading orders:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadOrders();
//   }, []);

//   // selected order (memoized)
//   const selected = useMemo(() => {
//     if (!orderId) return null;
//     return orders.find((o) => o.id === orderId) ?? null;
//   }, [orders, orderId]);

//   // Filter and search orders
//   const filteredOrders = useMemo(() => {
//     return orders.filter(order => {
//       const matchesSearch = order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                           order.id.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesStatus = statusFilter === "all" || order.status === statusFilter;
//       return matchesSearch && matchesStatus;
//     });
//   }, [orders, searchQuery, statusFilter]);

//   const refreshOrders = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       try {
//         const loadedOrders = readLocalOrders();
//         setOrders(loadedOrders);
//       } catch (error) {
//         console.error("Error refreshing orders:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }, 500);
//   };

//   const removeOrder = (orderId: string) => {
//     const updatedOrders = orders.filter(order => order.id !== orderId);
//     try {
//       localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
//       setOrders(updatedOrders);
//       if (orderId === selected?.id) {
//         router.push("/auth/order");
//       }
//     } catch (error) {
//       console.error("Error removing order:", error);
//     }
//   };

//   const getStatusIcon = (status: string = "pending") => {
//     switch (status.toLowerCase()) {
//       case "delivered":
//         return <CheckCircle className="w-5 h-5 text-green-500" />;
//       case "shipped":
//         return <Truck className="w-5 h-5 text-blue-500" />;
//       case "processing":
//         return <Package className="w-5 h-5 text-orange-500" />;
//       default:
//         return <Clock className="w-5 h-5 text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status: string = "pending") => {
//     switch (status.toLowerCase()) {
//       case "delivered":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "shipped":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       case "processing":
//         return "bg-orange-100 text-orange-800 border-orange-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   // If ?id=... provided but not found
//   if (orderId && !selected && !isLoading) {
//     return (
//       <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white rounded-3xl shadow-xl p-8 text-center"
//           >
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <X className="w-8 h-8 text-red-500" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
//             <p className="text-gray-600 mb-6">
//               No order with ID <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderId}</span> exists locally.
//             </p>
//             <div className="flex gap-3 justify-center">
//               <Link 
//                 href="/auth/order" 
//                 className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
//               >
//                 Back to Orders
//               </Link>
//               <button
//                 onClick={refreshOrders}
//                 className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 Refresh
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   // If orderId present and selected found — show order details
//   if (orderId && selected && !isLoading) {
//     const order = selected;
//     const total = order.price * order.qty;

//     return (
//       <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="flex items-center justify-between mb-8"
//           >
//             <Link 
//               href="/auth/order" 
//               className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               Back to Orders
//             </Link>
//             <button
//               onClick={refreshOrders}
//               className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//             >
//               <RefreshCw className="w-5 h-5" />
//               Refresh
//             </button>
//           </motion.div>

//           {/* Order Details Card */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="bg-white rounded-3xl shadow-xl p-8"
//           >
//             {/* Order Header */}
//             <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-4">
//                   {getStatusIcon(order.status)}
//                   <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
//                     {order.status ?? "Pending"}
//                   </span>
//                 </div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">{order.name}</h1>
//                 <p className="text-gray-600">Order ID: <span className="font-mono">{order.id}</span></p>
//                 <p className="text-sm text-gray-500 mt-2">
//                   Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
//                 </p>
//               </div>

//               <div className="text-right">
//                 <div className="text-4xl font-bold text-gray-900 mb-2">₹{total.toFixed(0)}</div>
//                 <p className="text-gray-600">Quantity: {order.qty}</p>
//                 <p className="text-gray-600">Unit Price: ₹{order.price}</p>
//               </div>
//             </div>

//             {/* Order Timeline */}
//             <div className="border-t border-gray-200 pt-8">
//               <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center gap-4">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                   <div>
//                     <p className="font-medium text-gray-900">Order Placed</p>
//                     <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                   <div>
//                     <p className="font-medium text-gray-900">Order Confirmed</p>
//                     <p className="text-sm text-gray-500">Processing your order</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
//                   <div>
//                     <p className="font-medium text-gray-500">Shipped</p>
//                     <p className="text-sm text-gray-400">Will update soon</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="border-t border-gray-200 pt-8 flex gap-4">
//               <button
//                 onClick={() => removeOrder(order.id)}
//                 className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
//               >
//                 Remove Order
//               </button>
//               <Link
//                 href="/products"
//                 className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
//               >
//                 Continue Shopping
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   // Default: show orders list
//   return (
//     <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
//         >
//           <div>
//             <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Orders</h1>
//             <p className="text-gray-600">Track and manage your orders</p>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <Link 
//               href="/products" 
//               className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               Back to Products
//             </Link>
//             <button
//               onClick={refreshOrders}
//               disabled={isLoading}
//               className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
//             >
//               <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
//               Refresh
//             </button>
//           </div>
//         </motion.div>

//         {/* Search and Filter */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-white rounded-2xl shadow-lg p-6 mb-8"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//             </div>

//             {/* Status Filter */}
//             <div className="relative">
//               <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="processing">Processing</option>
//                 <option value="shipped">Shipped</option>
//                 <option value="delivered">Delivered</option>
//               </select>
//             </div>
//           </div>
//         </motion.div>

//         {/* Orders List */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           {isLoading ? (
//             <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
//               <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600">Loading your orders...</p>
//             </div>
//           ) : filteredOrders.length === 0 ? (
//             <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
//               <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
//               <p className="text-gray-600 mb-6">
//                 {orders.length === 0 
//                   ? "You haven't placed any orders yet." 
//                   : "No orders match your search criteria."}
//               </p>
//               <Link 
//                 href="/products" 
//                 className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-block"
//               >
//                 Start Shopping
//               </Link>
//             </div>
//           ) : (
//             <div className="grid gap-6">
//               <AnimatePresence>
//                 {filteredOrders.map((order, index) => (
//                   <motion.div
//                     key={order.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ delay: index * 0.1 }}
//                     className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
//                   >
//                     <Link href={`/auth/order?id=${order.id}`} className="block p-6">
//                       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 mb-3">
//                             {getStatusIcon(order.status)}
//                             <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
//                               {order.status ?? "Pending"}
//                             </span>
//                           </div>
//                           <h3 className="text-xl font-semibold text-gray-900 mb-2">{order.name}</h3>
//                           <p className="text-gray-600 text-sm">Order ID: {order.id}</p>
//                           <p className="text-gray-500 text-sm mt-2">
//                             Placed on {new Date(order.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>

//                         <div className="text-right">
//                           <div className="text-2xl font-bold text-gray-900 mb-2">
//                             ₹{(order.price * order.qty).toFixed(0)}
//                           </div>
//                           <p className="text-gray-600">Quantity: {order.qty}</p>
//                           <p className="text-sm text-indigo-600 mt-2 hover:underline">View Details →</p>
//                         </div>
//                       </div>
//                     </Link>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// }


// app/orders/page.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  RefreshCw, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  Search,
  Filter,
  X
} from "lucide-react";

type LocalOrder = {
  id: string;
  productId: string;
  name?: string;
  price: number;
  qty: number;
  createdAt: string;
  status?: string;
};

const ORDERS_KEY = "orders_v1";

/** Safe read orders from storage */
function readLocalOrders(): LocalOrder[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(ORDERS_KEY) ?? localStorage.getItem("orders") : null;
    if (!raw) return [];
    
    const parsed = JSON.parse(raw) as LocalOrder[];
    // Ensure all orders have required fields with fallbacks
    return parsed.map(order => ({
      id: order.id || `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: order.productId || 'unknown',
      name: order.name || 'Unnamed Product',
      price: typeof order.price === 'number' ? order.price : 0,
      qty: typeof order.qty === 'number' ? order.qty : 1,
      createdAt: order.createdAt || new Date().toISOString(),
      status: order.status || 'pending'
    }));
  } catch {
    return [];
  }
}

/** Component */
export default function OrdersPage() {
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const search = useSearchParams();
  const router = useRouter();
  const orderId = search?.get("id") ?? null;

  // Load orders on component mount
  useEffect(() => {
    const loadOrders = () => {
      setIsLoading(true);
      try {
        const loadedOrders = readLocalOrders();
        setOrders(loadedOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // selected order (memoized)
  const selected = useMemo(() => {
    if (!orderId) return null;
    return orders.find((o) => o.id === orderId) ?? null;
  }, [orders, orderId]);

  // Filter and search orders with safe string handling
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderName = order.name || 'Unnamed Product';
      const orderId = order.id || '';
      const orderStatus = order.status || 'pending';
      
      const matchesSearch = 
        orderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        orderId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || orderStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const refreshOrders = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const loadedOrders = readLocalOrders();
        setOrders(loadedOrders);
      } catch (error) {
        console.error("Error refreshing orders:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const removeOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      if (orderId === selected?.id) {
        router.push("/orders");
      }
    } catch (error) {
      console.error("Error removing order:", error);
    }
  };

  const getStatusIcon = (status: string = "pending") => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "processing":
        return <Package className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string = "pending") => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // If ?id=... provided but not found
  if (orderId && !selected && !isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">
              No order with ID <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderId}</span> exists locally.
            </p>
            <div className="flex gap-3 justify-center">
              <Link 
                href="/orders" 
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Back to Orders
              </Link>
              <button
                onClick={refreshOrders}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // If orderId present and selected found — show order details
  if (orderId && selected && !isLoading) {
    const order = selected;
    const total = order.price * order.qty;

    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <Link 
              href="/orders" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Orders
            </Link>
            <button
              onClick={refreshOrders}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </motion.div>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            {/* Order Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon(order.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{order.name}</h1>
                <p className="text-gray-600">Order ID: <span className="font-mono">{order.id}</span></p>
                <p className="text-sm text-gray-500 mt-2">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>

              <div className="text-right">
                <div className="text-4xl font-bold text-gray-900 mb-2">₹{total.toFixed(0)}</div>
                <p className="text-gray-600">Quantity: {order.qty}</p>
                <p className="text-gray-600">Unit Price: ₹{order.price}</p>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Order Confirmed</p>
                    <p className="text-sm text-gray-500">Processing your order</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-500">Shipped</p>
                    <p className="text-sm text-gray-400">Will update soon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 pt-8 flex gap-4">
              <button
                onClick={() => removeOrder(order.id)}
                className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Remove Order
              </button>
              <Link
                href="/products"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Default: show orders list
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/products" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </Link>
            <button
              onClick={refreshOrders}
              disabled={isLoading}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {orders.length === 0 ? "No Orders Found" : "No Matching Orders"}
              </h3>
              <p className="text-gray-600 mb-6">
                {orders.length === 0 
                  ? "You haven't placed any orders yet." 
                  : "No orders match your search criteria."}
              </p>
              <Link 
                href="/products" 
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-block"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <Link href={`/orders?id=${order.id}`} className="block p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            {getStatusIcon(order.status)}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{order.name}</h3>
                          <p className="text-gray-600 text-sm">Order ID: {order.id}</p>
                          <p className="text-gray-500 text-sm mt-2">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 mb-2">
                            ₹{((order.price || 0) * (order.qty || 1)).toFixed(0)}
                          </div>
                          <p className="text-gray-600">Quantity: {order.qty}</p>
                          <p className="text-sm text-indigo-600 mt-2 hover:underline">View Details →</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}