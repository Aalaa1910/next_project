"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AddToCartButton from "../../components/AddToCartButton";
import DescriptionToggle from "../../components/DescriptionToggle";
import WishlistButton from "../../components/WishlistButton";
import {
  Product,
  formatCategoryLabel,
  toCartProduct,
} from "../../lib/products";
import ProductQuantitySelector from "./ProductQuantitySelector";

type ProductDetailClientProps = {
  productId: string;
  initialProduct: Product;
};

async function fetchProduct(productId: string): Promise<Product> {
  const response = await fetch(`/api/products/${productId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load product");
  }

  return response.json();
}

function StarRating({ rate }: { rate: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={index < Math.round(rate) ? "text-yellow-400" : "text-gray-300"}
        >
          *
        </span>
      ))}
    </div>
  );
}

export default function ProductDetailClient({
  productId,
  initialProduct,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);

  const { data: product = initialProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    initialData: initialProduct,
    staleTime: 1000 * 60 * 5,
  });

  const image = product.thumbnail ?? product.image ?? product.images[0];

  return (
    <div>
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-brand"
      >
        Back to Products
      </Link>

      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
        <div className="flex items-center justify-center rounded-2xl border border-border bg-surface-card p-10">
          <Image
            src={image}
            alt={product.title}
            width={360}
            height={360}
            className="max-h-80 object-contain"
            priority
          />
        </div>

        <div className="flex flex-col gap-5">
          <span className="w-fit rounded-md border border-border bg-surface-card px-2 py-1 text-xs text-gray-500 capitalize">
            {formatCategoryLabel(product.category)}
          </span>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold leading-snug">{product.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <StarRating rate={product.rating ?? 0} />
              <span>{(product.rating ?? 0).toFixed(1)} rating</span>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <p className="text-4xl font-bold text-brand">${product.price}</p>
            {product.stock ? (
              <span className="pb-1 text-sm text-gray-500">
                {product.stock} in stock
              </span>
            ) : null}
          </div>

          <DescriptionToggle
            text={product.description}
            maxLength={180}
            className="text-sm leading-relaxed text-gray-600"
          />

          <div className="rounded-2xl border border-border bg-surface-card p-5 space-y-4">
            <ProductQuantitySelector
              quantity={quantity}
              onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
              onIncrease={() => setQuantity((current) => current + 1)}
            />

            <AddToCartButton
              product={toCartProduct(product)}
              quantity={quantity}
              className="w-full justify-center py-3 text-base"
            />

            <p className="text-xs text-gray-500">
              {quantity} item{quantity > 1 ? "s" : ""} will be added to your cart.
            </p>
          </div>

          <WishlistButton
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              image,
              category: product.category,
            }}
          />
        </div>
      </div>
    </div>
  );
}
