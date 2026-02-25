"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Package, Settings, LogOut, ChevronRight, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";

interface OrderItem {
    id: string;
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

interface UserData {
    id: string;
    name: string;
    email: string;
    phone?: string;
    isVerified: boolean;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                const token = localStorage.getItem("accessToken");

                if (!storedUser || !token) {
                    router.push("/auth/login");
                    return;
                }

                const userData = JSON.parse(storedUser);
                setUser(userData);

                // Fetch orders from API
                const res = await fetch("/api/orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                } else if (res.status === 401) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("accessToken");
                    router.push("/auth/login");
                }
            } catch (error) {
                console.error("Profile fetch error:", error);
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        toast.success("Logged out successfully");
        router.push("/");
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Sidebar / User Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative">
                                <div className="absolute -bottom-12 left-8">
                                    <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center p-1">
                                        <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-indigo-600">
                                            <User size={40} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-16 pb-8 px-8">
                                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                                <p className="text-gray-500">Premium Member</p>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Mail size={18} className="text-indigo-600" />
                                        <span>{user?.email}</span>
                                    </div>
                                    {user?.phone && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Phone size={18} className="text-indigo-600" />
                                            <span>{user?.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Calendar size={18} className="text-indigo-600" />
                                        <span>Joined {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100 space-y-2">
                                    <button
                                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Settings size={18} />
                                            <span>Account Settings</span>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 transition-colors group text-red-600"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LogOut size={18} />
                                            <span>Sign Out</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content / Orders */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <Package className="text-indigo-600" />
                                    Recent Orders
                                </h2>
                                <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-sm font-medium">
                                    {orders.length} Orders
                                </span>
                            </div>

                            {orders.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400 shadow-sm">
                                        <Package size={30} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
                                    <p className="text-gray-500 mt-1 mb-6">Looks like you haven't placed any orders yet.</p>
                                    <button
                                        onClick={() => router.push("/products")}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <motion.div
                                            key={order.id}
                                            whileHover={{ scale: 1.01 }}
                                            className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer group"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-900 text-lg">Order #{order.id.slice(-6).toUpperCase()}</span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                                order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                                    'bg-indigo-100 text-indigo-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-indigo-600">₹{order.total.toFixed(2)}</p>
                                                    <p className="text-xs text-gray-400">{order.items.length} items</p>
                                                </div>
                                            </div>

                                            {/* Item Preview */}
                                            <div className="mt-4 flex gap-2 overflow-hidden">
                                                {order.items.map((item, idx) => (
                                                    <span key={idx} className="bg-gray-50 text-xs px-3 py-1 rounded-lg text-gray-600 whitespace-nowrap">
                                                        {item.name} x{item.qty}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
