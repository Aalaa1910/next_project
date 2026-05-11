"use client";

import { useState } from "react";
import { CartProduct } from "../lib/products";
import { useCart } from "../context/CartContext";

type AddToCartButtonProps = {
  product: CartProduct;
  quantity?: number;
  className?: string;
};

export default function AddToCartButton({
  product,
  quantity = 1,
  className = "",
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const { addToCart, isReady } = useCart();

  const handleClick = () => {
    if (!isReady) return;

    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isReady}
      className={`mt-auto px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 text-sm ${
        added
          ? "bg-green-600"
          : "bg-brand hover:bg-brand-hover hover:-translate-y-0.5"
      } disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {added ? "Added to Cart" : "Add to Cart"}
    </button>
  );
}
