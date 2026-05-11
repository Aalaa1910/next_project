"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { getShippingOptionById, getShippingOptions } from "../lib/shipping";

export default function CartSummary() {
  const { items, isReady } = useCart();
  const [selectedShippingId, setSelectedShippingId] = useState("");

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const shippingOptions = useMemo(
    () => getShippingOptions(subtotal),
    [subtotal]
  );
  const selectedShipping = getShippingOptionById(subtotal, selectedShippingId);
  const total = subtotal + (selectedShipping?.price ?? 0);
  const checkoutHref = selectedShippingId
    ? `/checkout?shipping=${selectedShippingId}`
    : "/checkout";

  return (
    <aside className="h-fit rounded-2xl border border-border bg-surface-card p-6 space-y-5">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
        <p className="text-sm text-gray-600">
          Review your cart items, see the cost breakdown, and choose your
          shipping option before proceeding to checkout.
        </p>
      </div>

      <div className="space-y-3 border-b border-border pb-5">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Items</span>
          <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>
            {selectedShipping
              ? `$${selectedShipping.price.toFixed(2)}`
              : "Choose a method"}
          </span>
        </div>
        <div className="flex items-center justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
          Shipping options
        </h3>
        {shippingOptions.map((option) => (
          <label
            key={option.id}
            className={`block rounded-xl border p-3 ${
              option.id === selectedShippingId
                ? "border-brand bg-brand/5"
                : "border-border bg-white"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="shipping-option"
                  value={option.id}
                  checked={option.id === selectedShippingId}
                  onChange={() => setSelectedShippingId(option.id)}
                  disabled={!isReady || items.length === 0}
                  className="mt-1 h-4 w-4 accent-brand"
                />
                <div>
                  <p className="font-medium text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">
                ${option.price.toFixed(2)}
              </span>
            </div>
          </label>
        ))}
      </div>

      {items.length > 0 && !selectedShipping && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Choose a shipping method before proceeding to checkout.
        </p>
      )}

      {items.length === 0 ? (
        <Link
          href="/products"
          className="inline-flex w-full justify-center rounded-lg bg-gray-400 px-5 py-3 font-semibold text-white transition hover:bg-gray-500"
        >
          Continue shopping
        </Link>
      ) : selectedShipping ? (
        <Link
          href={checkoutHref}
          className="inline-flex w-full justify-center rounded-lg bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand-hover"
        >
          Proceed to checkout
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="inline-flex w-full justify-center rounded-lg bg-gray-300 px-5 py-3 font-semibold text-white"
        >
          Proceed to checkout
        </button>
      )}
    </aside>
  );
}
