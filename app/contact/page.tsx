"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail, MessageSquare, Globe, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        toast.success("Message transmitted. We will reach out shortly.");
        setForm({ name: "", email: "", subject: "", message: "" });
        setLoading(false);
    };

    const contactInfo = [
        {
            icon: <Mail className="text-indigo-600" size={24} />,
            title: "EMAIL THE ARCHIVE",
            desc: "hello@shopcart.studio",
            action: "mailto:hello@shopcart.studio"
        },
        {
            icon: <Phone className="text-indigo-600" size={24} />,
            title: "VOICE CHANNEL",
            desc: "+1 (888) 555-0123",
            action: "tel:+18885550123"
        },
        {
            icon: <MapPin className="text-indigo-600" size={24} />,
            title: "HEADQUARTERS",
            desc: "88 Silicon Dr, Meta City, 90210",
            action: "#"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-12">
                        <div className="max-w-3xl">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs font-black tracking-[0.3em] text-indigo-600 uppercase mb-6 block"
                            >
                                Connect with the Archive
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9]"
                            >
                                LET'S SHAPE THE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">DIGITAL LEGACY.</span>
                            </motion.h1>
                        </div>
                    </div>
                </div>
                {/* Background Decorative */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 -z-10 translate-x-1/2" />
            </section>

            {/* Main Content */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left: Info Cards */}
                    <div className="lg:col-span-4 space-y-8">
                        {contactInfo.map((info, i) => (
                            <motion.a
                                key={i}
                                href={info.action}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="block p-8 bg-gray-50 rounded-[32px] border border-gray-100 group hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-500"
                            >
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-white/20 transition-all">
                                    {info.icon}
                                </div>
                                <h3 className="text-xs font-black tracking-widest text-gray-400 group-hover:text-white/60 mb-2 uppercase">{info.title}</h3>
                                <p className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors">{info.desc}</p>
                            </motion.a>
                        ))}

                        <div className="p-8 rounded-[32px] bg-gray-900 text-white overflow-hidden relative group">
                            <div className="relative z-10">
                                <p className="text-gray-400 font-bold mb-4 italic">"Design is not just what it looks like, it's how it works."</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-700" />
                                    <div>
                                        <p className="text-sm font-black">CURATOR TEAM</p>
                                        <p className="text-xs text-gray-500">Shopcart Archive</p>
                                    </div>
                                </div>
                            </div>
                            <Globe className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5 group-hover:text-white/10 transition-all duration-700" size={160} />
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100"
                        >
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Your Name</label>
                                        <input
                                            required
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            type="text"
                                            placeholder="Specify your tag"
                                            className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold placeholder:text-gray-300"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Email Address</label>
                                        <input
                                            required
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            type="email"
                                            placeholder="Where should we reply?"
                                            className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Subject of Enquiry</label>
                                    <select
                                        value={form.subject}
                                        onChange={e => setForm({ ...form, subject: e.target.value })}
                                        className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Enqury Type</option>
                                        <option value="Collab">Collaboration</option>
                                        <option value="Order">Order Retrieval</option>
                                        <option value="Support">Technical Support</option>
                                        <option value="Archive">Archive Access</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Message Content</label>
                                    <textarea
                                        required
                                        value={form.message}
                                        onChange={e => setForm({ ...form, message: e.target.value })}
                                        rows={6}
                                        placeholder="How can we assist your journey?"
                                        className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold placeholder:text-gray-300 resize-none"
                                    />
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full md:w-auto px-12 py-5 bg-gray-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all duration-500 shadow-xl shadow-gray-200"
                                >
                                    {loading ? (
                                        <>TRANSMITTING... <Loader2 className="animate-spin" size={20} /></>
                                    ) : (
                                        <>SEND MESSAGE <Send size={20} /></>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Modern Map/Visual Placeholder */}
            <section className="py-20 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-7xl mx-auto h-[500px] bg-gray-100 rounded-[60px] relative overflow-hidden flex items-center justify-center border border-gray-100 shadow-inner"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 z-0" />
                    <div className="relative z-10 text-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-100">
                            <Globe className="text-indigo-600 animate-pulse" size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight uppercase">Global Presence</h2>
                        <p className="text-gray-500 font-bold">Serving the digital elite from every corner of the planet.</p>
                    </div>

                    {/* Mock Grid Lines for Architectural feel */}
                    <div className="absolute inset-0 grid grid-cols-12 pointer-events-none opacity-[0.03]">
                        {[...Array(12)].map((_, i) => <div key={i} className="border-r border-gray-900 h-full" />)}
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
