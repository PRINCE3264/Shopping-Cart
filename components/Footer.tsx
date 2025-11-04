"use client";

import React, { useState } from "react";
import Link from "next/link";

/**
 * Footer.tsx
 * - No jQuery
 * - No `any`
 * - Accessible, Tailwind-based
 */

export default function Footer(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = /^\S+@\S+\.\S+$/.test(email);
    if (!isValid) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    // demo fake async subscribe — replace with real API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 700);
  };

  return (
    <footer
      aria-labelledby="site-footer"
      className="bg-slate-900 text-slate-200 mt-12"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold text-white" aria-label="Home">
              <span className="inline-block w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md shadow-sm" />
              <span>MyNextShop</span>
            </Link>

            <p className="mt-3 text-sm text-slate-300 max-w-sm">
              Small demo shop built with Next.js and Tailwind CSS. Clean, accessible, and easy to customize.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <a href="#" aria-label="Twitter" className="text-slate-300 hover:text-white">Twitter</a>
              <a href="#" aria-label="GitHub" className="text-slate-300 hover:text-white">GitHub</a>
              <a href="#" aria-label="Instagram" className="text-slate-300 hover:text-white">Instagram</a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:col-span-1">
            <div>
              <h3 className="text-sm font-semibold text-white">Shop</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li><Link href="/products">Products</Link></li>
                <li><Link href="/orders">Orders</Link></li>
                <li><Link href="/sale">Sale</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Company</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Support</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/returns">Returns</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Subscribe to our newsletter</h3>
            <p className="mt-2 text-sm text-slate-300">Get updates about new products and special offers.</p>

            <form className="mt-4 flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="min-w-0 w-full px-3 py-2 rounded-md border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? "email-error" : undefined}
              />

              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:opacity-95"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Subscribe"}
              </button>
            </form>

            <div className="mt-3 text-sm">
              {status === "error" && <div id="email-error" className="text-amber-300">Please enter a valid email.</div>}
              {status === "success" && (
                <div className="text-emerald-400 transition-opacity duration-300 opacity-100">Thanks — you’re subscribed!</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} MyNextShop. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/terms" className="text-slate-300 hover:text-white">Terms</Link>
            <Link href="/privacy" className="text-slate-300 hover:text-white">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
