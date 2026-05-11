"use client";

import { useActionState } from "react";
import { addToWishlistAction } from "../actions/wishlist";

type WishlistActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialWishlistState: WishlistActionState = {
  status: "idle",
  message: "",
};

type WishlistButtonProps = {
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
  };
};

export default function WishlistButton({ product }: WishlistButtonProps) {
  const [state, formAction, isPending] = useActionState(
    addToWishlistAction,
    initialWishlistState
  );

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="id" value={product.id} />
      <input type="hidden" name="title" value={product.title} />
      <input type="hidden" name="price" value={product.price} />
      <input type="hidden" name="image" value={product.image} />
      <input type="hidden" name="category" value={product.category} />

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Add to Wishlist"}
      </button>

      {state.message ? (
        <p
          className={`text-xs ${
            state.status === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
