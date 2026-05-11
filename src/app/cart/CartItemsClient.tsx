"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import CartQuantityControl from "./CartQuantityControl";
import RemoveCartItemButton from "./RemoveCartItemButton";

export default function CartItemsClient() {
  const router = useRouter();
  const { items, isReady, removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (id: number, quantity: number) => {
    updateQuantity(id, quantity);
    router.refresh();
  };

  const handleRemove = (id: number) => {
    removeFromCart(id);
    router.refresh();
  };

  if (!isReady) {
    return (
      <section className="rounded-2xl border border-border bg-surface-card p-6">
        <p className="text-sm text-gray-500">Loading your cart...</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-surface-card p-8 text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="text-gray-600">
          Add a few products and they will show up here for this account only.
        </p>
        <Link
          href="/products"
          className="inline-flex rounded-lg bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand-hover"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Shopping cart</h1>
        <p className="text-gray-600">
          Update quantities or remove items before checkout.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-card p-4 sm:flex-row sm:items-center"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={96}
              height={96}
              className="h-24 w-24 rounded-xl object-cover bg-white"
            />

            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500">
                ${item.price.toFixed(2)} each
              </p>
            </div>

            <div className="flex items-center gap-3">
              <CartQuantityControl
                productTitle={item.title}
                quantity={item.quantity}
                onDecrease={() =>
                  handleQuantityChange(item.id, Math.max(1, item.quantity - 1))
                }
                onIncrease={() => handleQuantityChange(item.id, item.quantity + 1)}
              />

              <div className="min-w-24 text-right">
                <p className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <RemoveCartItemButton onRemove={() => handleRemove(item.id)} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
