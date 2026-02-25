"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Truck,
  Shield,
  Lock,
  CheckCircle,
  ArrowLeft,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartCount, total: cartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const subtotal = cartTotal;
  const shipping = subtotal > 0 ? 49 : 0;
  const tax = +(subtotal * 0.12).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  // Payment mock
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { number: 1, title: "Shipping", icon: <Truck className="w-5 h-5" /> },
    { number: 2, title: "Payment", icon: <CreditCard className="w-5 h-5" /> },
    { number: 3, title: "Confirmation", icon: <CheckCircle className="w-5 h-5" /> }
  ];

  const validateShipping = () => {
    if (!name.trim()) return "Name is required";
    if (!email.includes("@")) return "Valid email required";
    if (!address.trim()) return "Address required";
    if (!city.trim()) return "City required";
    if (!/^[0-9]{5,6}$/.test(pincode)) return "Pincode must be 5–6 digits";
    return null;
  };

  const validatePayment = () => {
    if (!/^[0-9\s]{12,19}$/.test(cardNumber)) return "Enter a valid card number";
    if (!/^[0-9]{3,4}$/.test(cvv)) return "Enter a valid CVV";
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry)) return "Expiry must be MM/YY";
    if (!cardName.trim()) return "Cardholder name is required";
    return null;
  };

  const placeOrder = async () => {
    setError(null);
    const paymentError = validatePayment();
    if (paymentError) {
      setError(paymentError);
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = localStorage.getItem("accessToken");
      const sessionId = localStorage.getItem("cart_sessionId");

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ sessionId })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push("/orders");
      } else {
        setError(data.error || "Failed to place order");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const err = validateShipping();
      if (err) {
        setError(err);
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
    setError(null);
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} /> Back to Cart
          </button>
          <h1 className="text-3xl font-black text-gray-900">CHECKOUT</h1>
          <div className="w-24"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex justify-between">
              {steps.map((step) => (
                <div key={step.number} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${currentStep >= step.number ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                    {step.number}
                  </div>
                  <span className={`text-sm font-bold ${currentStep >= step.number ? "text-gray-900" : "text-gray-400"}`}>{step.title}</span>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                <motion.div key="ship" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <h2 className="text-2xl font-black text-gray-900 mb-6">SHIPPING DETAILS</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-600 outline-none font-medium" />
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-600 outline-none font-medium" />
                    <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-600 outline-none font-medium md:col-span-2" />
                    <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-600 outline-none font-medium" />
                    <input value={pincode} onChange={e => setPincode(e.target.value)} placeholder="PIN Code" className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-600 outline-none font-medium" />
                  </div>
                  <button onClick={nextStep} className="mt-8 w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-gray-800 transition-all">
                    CONTINUE TO PAYMENT
                  </button>
                </motion.div>
              ) : (
                <motion.div key="pay" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <h2 className="text-2xl font-black text-gray-900 mb-6">PAYMENT METHOD</h2>
                  <div className="space-y-6">
                    <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Name on Card" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-600 outline-none font-medium" />
                    <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="Card Number" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-600 outline-none font-medium" />
                    <div className="grid grid-cols-2 gap-6">
                      <input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-600 outline-none font-medium" />
                      <input value={cvv} onChange={e => setCvv(e.target.value)} placeholder="CVV" className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-600 outline-none font-medium" />
                    </div>
                  </div>
                  <div className="mt-8 flex gap-4">
                    <button onClick={() => setCurrentStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all">BACK</button>
                    <button onClick={placeOrder} disabled={loading} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all disabled:opacity-50">
                      {loading ? "PROCESSING..." : `PAY ₹${total}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {error && <p className="text-red-500 font-bold text-center mt-4">⚠️ {error}</p>}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 sticky top-24">
              <h3 className="text-xl font-black text-gray-900 mb-6">ORDER SUMMARY</h3>
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl relative overflow-hidden flex-shrink-0">
                      {item.img && <Image src={item.img} alt={item.title} fill className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{item.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <p className="font-bold text-gray-900">₹{item.price * item.qty}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-500 font-medium"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-gray-500 font-medium"><span>Shipping</span><span>₹{shipping}</span></div>
                <div className="flex justify-between text-gray-500 font-medium"><span>Tax</span><span>₹{tax}</span></div>
                <div className="flex justify-between text-gray-900 font-black text-xl pt-2"><span>Total</span><span>₹{total}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}