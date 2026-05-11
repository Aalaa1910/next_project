"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { Product, toCartProduct } from "../lib/products";

type FeaturedProductsProps = {
  initialProducts: Product[];
};

const filters = [
  { label: "Top rated", value: "top-rated" },
  { label: "Budget", value: "budget" },
  { label: "Premium", value: "premium" },
] as const;

type FeaturedFilter = (typeof filters)[number]["value"];

function selectFeaturedProducts(products: Product[], filter: FeaturedFilter) {
  if (filter === "budget") {
    return [...products].sort((a, b) => a.price - b.price).slice(0, 4);
  }

  if (filter === "premium") {
    return [...products].sort((a, b) => b.price - a.price).slice(0, 4);
  }

  return [...products].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 4);
}

export default function FeaturedProducts({
  initialProducts,
}: FeaturedProductsProps) {
  const [filter, setFilter] = useState<FeaturedFilter>("top-rated");

  const { data: products = initialProducts } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => initialProducts,
    initialData: initialProducts,
  });

  const featuredProducts = useMemo(
    () => selectFeaturedProducts(products, filter),
    [filter, products]
  );

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Featured products</h2>
          <p className="text-gray-600 text-sm mt-1">
            
          </p>
        </div>

        <div className="flex rounded-lg border border-border bg-surface-card p-1">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                filter === item.value
                  ? "bg-brand text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredProducts.map((product) => (
          <article
            key={product.id}
            className="border border-border rounded-lg p-4 flex flex-col gap-3 bg-surface-card hover:border-brand/60 transition"
          >
            <img
              src={product.thumbnail ?? product.image ?? product.images[0]}
              alt={product.title}
              className="w-full h-48 object-cover rounded bg-white"
            />
            <div className="space-y-1">
              <h3 className="font-semibold text-sm line-clamp-2">
                {product.title}
              </h3>
              <p className="text-gray-500 text-xs capitalize">
                {product.category}
              </p>
            </div>
            <p className="font-bold">${product.price}</p>
            <AddToCartButton product={toCartProduct(product)} />
          </article>
        ))}
      </div>
    </section>
  );
}
