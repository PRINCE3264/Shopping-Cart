"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, Instagram, Twitter, Github, Linkedin, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Welcome to the exclusive circle!");
    setEmail("");
    setLoading(false);
  };

  const footerLinks = [
    {
      title: "COLLECTION",
      links: [
        { name: "New Arrivals", path: "/products" },
        { name: "Best Sellers", path: "/products" },
        { name: "Sale Drops", path: "/products" },
        { name: "Archive", path: "/products" },
      ]
    },
    {
      title: "COMPANY",
      links: [
        { name: "About Essence", path: "/about" },
        { name: "Journal (Blog)", path: "/blog" },
        { name: "Reach Out", path: "/contact" },
        { name: "Careers", path: "/careers" },
      ]
    },
    {
      title: "SUPPORT",
      links: [
        { name: "Order Tracking", path: "/orders" },
        { name: "Returns Policy", path: "/returns" },
        { name: "Privacy Vault", path: "/privacy" },
        { name: "Terms of Art", path: "/terms" },
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center group-hover:bg-indigo-500 transition-all duration-500">
                <span className="text-gray-900 font-black text-2xl group-hover:text-white transition-colors">S</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">SHOPCART</span>
            </Link>
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
              Creating a legacy of premium craftsmanship and architectural design. Redefining modern digital commerce.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 border border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 hover:bg-gray-800 transition-all duration-300">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-12">
            {footerLinks.map((section, idx) => (
              <div key={idx} className="space-y-6">
                <h4 className="text-xs font-black text-gray-500 tracking-[0.2em] uppercase">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link href={link.path} className="text-gray-400 font-bold hover:text-white transition-colors flex items-center group">
                        {link.name}
                        <ArrowRight size={14} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 p-8 rounded-[32px] border border-gray-700/50 backdrop-blur-sm">
              <h4 className="text-lg font-black text-white mb-2">JOIN THE CIRCLE</h4>
              <p className="text-gray-400 text-sm mb-6">Receive exclusive event invites and early drop access.</p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-white font-medium focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-gray-600"
                />
                <button
                  disabled={loading}
                  className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-500 hover:text-white transition-all duration-500"
                >
                  {loading ? "SENDING..." : <>SUBSCRIBE <Send size={16} /></>}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 font-bold text-sm">
            © {new Date().getFullYear()} SHOPCART DESIGN SYSTEM. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-sm font-bold text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
            <Link href="/terms" className="hover:text-white transition-colors">TERMS OF ART</Link>
            <Link href="/legal" className="hover:text-white transition-colors">LEGAL</Link>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] -z-10 rounded-full" />
    </footer>
  );
}
