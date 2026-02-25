"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Bookmark, Heart, Share2, Filter, Clock, Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BLOG_POSTS = [
    {
        id: 1,
        category: "CRAFT",
        title: "The Architecture of Minimalist Living",
        excerpt: "Exploring the intersection of structural integrity and aesthetic purity in modern object design.",
        author: "Elena Vance",
        date: "Feb 24, 2026",
        readingTime: "6 min read",
        image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1200",
        color: "bg-orange-500"
    },
    {
        id: 2,
        category: "CULTURE",
        title: "Legacy of the Mulberry Silk House",
        excerpt: "A deep dive into the centuries-old techniques behind our signature Ethereal Silk collections.",
        author: "Marcus Thorne",
        date: "Feb 20, 2026",
        readingTime: "12 min read",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200",
        color: "bg-indigo-500"
    },
    {
        id: 3,
        category: "INNOVATION",
        title: "Chronographs: Beyond the Machine",
        excerpt: "Why mechanical horology remains the pinnacle of human precision in an era of digital noise.",
        author: "Julian Drax",
        date: "Feb 15, 2026",
        readingTime: "8 min read",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1200",
        color: "bg-purple-500"
    },
    {
        id: 4,
        category: "DESIGN",
        title: "Sustainability is the New Luxury",
        excerpt: "How ethical sourcing and artisanal production are redefining what it means to be exclusive.",
        author: "Sasha Grey",
        date: "Feb 10, 2026",
        readingTime: "5 min read",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200",
        color: "bg-emerald-500"
    },
    {
        id: 5,
        category: "LIFESTYLE",
        title: "The Zenith Collection: Behind the Scenes",
        excerpt: "An exclusive look at the creative direction for this season's most anticipated archival drop.",
        author: "Curator Team",
        date: "Feb 05, 2026",
        readingTime: "4 min read",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200",
        color: "bg-blue-500"
    },
    {
        id: 6,
        category: "PHILOSOPHY",
        title: "Quiet Luxury vs. Loud Presence",
        excerpt: "Understanding the shift towards understated excellence in the global fashion landscape.",
        author: "Elena Vance",
        date: "Jan 28, 2026",
        readingTime: "10 min read",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200",
        color: "bg-pink-500"
    }
];

const CATEGORIES = ["All", "Craft", "Culture", "Innovation", "Design", "Lifestyle"];

export default function BlogPage() {
    const [activeTab, setActiveTab] = useState("All");
    const [search, setSearch] = useState("");

    const filteredPosts = BLOG_POSTS.filter(post => {
        const matchesTab = activeTab === "All" || post.category.toLowerCase() === activeTab.toLowerCase();
        const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <section className="pt-32 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
                    >
                        <div className="max-w-2xl">
                            <span className="text-xs font-black tracking-[0.4em] text-indigo-600 uppercase mb-4 block">Editorial Journal</span>
                            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9]">
                                CURATED <span className="text-gray-300">THOUGHTS.</span>
                            </h1>
                            <p className="mt-8 text-xl text-gray-500 font-medium max-w-lg leading-relaxed">
                                A repository of design philosophy, cultural shifts, and the technical mastery behind every Shopcart artifact.
                            </p>
                        </div>

                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search the archive..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                            />
                        </div>
                    </motion.div>

                    {/* Categories Tab */}
                    <div className="flex flex-wrap gap-2 mb-12 border-b border-gray-100 pb-8">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === cat ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
                            >
                                {cat.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Post (Wide) */}
            {activeTab === "All" && !search && (
                <section className="px-6 mb-20">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group cursor-pointer relative h-[500px] md:h-[600px] rounded-[40px] md:rounded-[60px] overflow-hidden"
                        >
                            <Image
                                src={BLOG_POSTS[1].image}
                                alt="Featured"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                            <div className="absolute bottom-12 left-6 right-6 md:left-12 md:right-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-black rounded-lg uppercase tracking-widest">Featured Insight</span>
                                    <span className="text-white/60 text-sm font-bold flex items-center gap-2"><Clock size={16} /> 12 MIN READ</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 max-w-3xl leading-[1.1]">
                                    THE LEGACY OF THE <br /> MULBERRY SILK HOUSE.
                                </h2>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md" />
                                        <span className="text-white font-bold">Marcus Thorne</span>
                                    </div>
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100">
                                        <ArrowRight size={24} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Posts Grid */}
            <section className="pb-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        <AnimatePresence mode="popLayout">
                            {filteredPosts.map((post, idx) => (
                                <motion.article
                                    key={post.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group"
                                >
                                    <div className="relative h-80 rounded-[32px] overflow-hidden mb-6 border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-gray-200 group-hover:-translate-y-2">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-4 py-1.5 ${post.color} text-white text-[10px] font-black rounded-lg uppercase tracking-widest`}>
                                                {post.category}
                                            </span>
                                        </div>
                                        <button className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-900 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <Bookmark size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readingTime}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-500 font-medium leading-relaxed line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="pt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black">
                                                    {post.author.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{post.author}</span>
                                            </div>
                                            <Link href={`/blog/${post.id}`} className="text-gray-900 font-black text-sm flex items-center gap-2 group/btn">
                                                READ ARTICLE <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Search size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">NO RECORDS FOUND</h3>
                            <p className="text-gray-500 font-medium">Try adjusting your search or category filter.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Bottom */}
            <section className="py-32 px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[60px] p-12 md:p-20 shadow-2xl shadow-gray-200 border border-gray-100"
                    >
                        <span className="text-xs font-black tracking-[0.4em] text-indigo-600 uppercase mb-4 block">Subscribe</span>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 leading-[0.9]">
                            STAY WITHIN THE <br /> <span className="text-gray-400">ARCHIVE.</span>
                        </h2>
                        <p className="text-lg text-gray-500 font-medium mb-12 max-w-lg mx-auto">
                            Weekly curated insights on design, tech and culture. Only the absolute essentials.
                        </p>
                        <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder="Expert@Industry.com"
                                className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
                            />
                            <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all">
                                JOIN THE LIST
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
