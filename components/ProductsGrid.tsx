// components/ProductsGrid.tsx
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { makeProducts, Product } from "@/lib/products";

type Props = {
  limit?: number;
  cols?: number; // optional: number of columns for layout (2,3,4)
};

export default function ProductsGrid({ limit = 4, cols = 4 }: Props) {
  const products = useMemo(() => makeProducts().slice(0, limit), [limit]);

  // responsive cols class
  const colsClass =
    cols === 2 ? "grid-cols-2" : cols === 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className="w-full">
      <div className="grid gap-4 auto-rows-fr " style={{ gridTemplateColumns: undefined }} >
        <div className={`grid gap-4 ${colsClass}`}>
          {products.map((p: Product) => (
            <article
              key={p.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <Link href={`/product/${p.id}`} className="block">
                <div className="relative w-full h-40 bg-gray-100">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      style={{ objectFit: "cover" }}
                      // priority false by default
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{p.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">₹{p.price.toFixed(2)}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
