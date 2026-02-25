"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          // If guest, we might want to fetch by sessionId too, 
          // but usually orders require an account. 
          // For now, let's just use the user token.
          setLoading(false);
          return;
        }

        const res = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else if (res.status === 401) {
          toast.error("Please login to view orders");
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Fetch orders error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const getStatusDetails = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return { icon: <CheckCircle className="text-green-500" />, text: "Delivered", color: "bg-green-50 text-green-700" };
      case "pending":
        return { icon: <Clock className="text-orange-500" />, text: "Processing", color: "bg-orange-50 text-orange-700" };
      case "shipped":
        return { icon: <Truck className="text-blue-500" />, text: "In Transit", color: "bg-blue-50 text-blue-700" };
      default:
        return { icon: <Package className="text-gray-500" />, text: status, color: "bg-gray-50 text-gray-700" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest">Retrieving your collection</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">MY ORDERS</h1>
            <p className="text-gray-500 font-medium">History of your premium acquisitions</p>
          </div>
          <button
            onClick={() => router.push("/products")}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl hover:border-gray-400 transition-all font-bold group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </button>
        </header>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[40px] shadow-2xl p-16 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">NO ORDERS YET</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium">Your archive is currently empty. Start your journey by exploring our latest drops.</p>
            <button
              onClick={() => router.push("/products")}
              className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200"
            >
              EXPLORE PRODUCTS
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const details = getStatusDetails(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500"
                >
                  <div className="p-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order Identifier</p>
                        <p className="text-xl font-bold text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                        <p className="font-bold text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div className={`px-5 py-2 rounded-xl flex items-center gap-2 ${details.color}`}>
                        {details.icon}
                        <span className="font-bold text-sm uppercase">{details.text}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid gap-6">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            </div>
                            <span className="font-bold text-gray-800">{item.name}</span>
                            <span className="text-gray-400 font-medium">x{item.qty}</span>
                          </div>
                          <span className="font-bold text-gray-900">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 bg-gray-50/50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Amount Paid</p>
                      <p className="text-3xl font-black text-gray-900">₹{order.total.toFixed(0)}</p>
                    </div>
                    <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-100 transition-all">
                      DOWNLOAD INVOICE
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}