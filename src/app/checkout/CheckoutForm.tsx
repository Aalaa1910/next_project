"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { placeOrderAction } from "../actions/checkout";
import { useCart } from "../context/CartContext";
import { getShippingOptionById, getShippingOptions } from "../lib/shipping";

type CheckoutFormProps = {
  userName: string;
  initialShippingId?: string;
};

type CheckoutActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialCheckoutState: CheckoutActionState = {
  status: "idle",
  message: "",
};

export default function CheckoutForm({
  userName,
  initialShippingId,
}: CheckoutFormProps) {
  const { items, clearCart } = useCart();
  const hasClearedCartRef = useRef(false);
  const [state, formAction, isPending] = useActionState(
    placeOrderAction,
    initialCheckoutState
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const shippingOptions = useMemo(
    () => getShippingOptions(subtotal),
    [subtotal]
  );
  const [selectedShippingId, setSelectedShippingId] = useState(
    initialShippingId ?? ""
  );
  const selectedShipping = getShippingOptionById(subtotal, selectedShippingId);
  const shipping = selectedShipping?.price ?? 0;
  const total = subtotal + shipping;
  const serializedItems = JSON.stringify(items);

  useEffect(() => {
    if (state.status === "success" && !hasClearedCartRef.current) {
      hasClearedCartRef.current = true;
      clearCart();
    }
  }, [clearCart, state.status]);

  if (state.status === "success") {
    return (
      <section className="max-w-2xl mx-auto bg-surface-card border border-border rounded-xl p-8 space-y-5 text-center">
        <h1 className="text-3xl font-bold">Order placed</h1>
        <p className="text-gray-600">{state.message}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/orders"
            className="inline-flex justify-center rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hover transition"
          >
            View orders
          </Link>
          <Link
            href="/profile"
            className="inline-flex justify-center rounded-lg border border-border bg-white px-5 py-3 font-semibold text-gray-700 hover:border-brand hover:text-brand transition"
          >
            Go to profile
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="max-w-2xl mx-auto bg-surface-card border border-border rounded-xl p-8 space-y-5 text-center">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-gray-600">
          Your cart is empty. Add products before starting checkout.
        </p>
        <Link
          href="/products"
          className="inline-flex justify-center rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hover transition"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-gray-600">
          {userName
            ? `Ready when you are, ${userName}.`
            : "Review your order and complete your purchase."}
        </p>
      </div>

      {state.message && (
        <div
          className={`rounded-lg p-4 ${
            state.status === "error"
              ? "border border-red-600/30 bg-red-50 text-red-700"
              : "border border-green-600/30 bg-green-50 text-green-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form
          action={formAction}
          className="bg-surface-card border border-border rounded-xl p-6 space-y-5"
        >
          <input type="hidden" name="items" value={serializedItems} />
          <input type="hidden" name="total" value={total} />
          <input type="hidden" name="shippingMethod" value={selectedShippingId} />
          <input type="hidden" name="shippingPrice" value={shipping} />

          <div>
            <h2 className="text-xl font-semibold">Shipping details</h2>
            <p className="text-sm text-gray-600">
              Enter the address where your order should be delivered.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-gray-700">Full name</span>
              <input
                required
                name="fullName"
                defaultValue={userName}
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-gray-900 outline-none focus:border-brand"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-gray-700">Phone</span>
              <input
                required
                name="phone"
                type="tel"
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-gray-900 outline-none focus:border-brand"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm text-gray-700">Address</span>
            <input
              required
              name="address"
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-gray-900 outline-none focus:border-brand"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-gray-700">City</span>
              <input
                required
                name="city"
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-gray-900 outline-none focus:border-brand"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-gray-700">Postal code</span>
              <input
                required
                name="postalCode"
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-gray-900 outline-none focus:border-brand"
              />
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold">Shipping method</h3>
              <p className="text-sm text-gray-600">
                Choose the delivery option that fits your order.
              </p>
            </div>
            <div className="space-y-3">
              {shippingOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${
                    option.id === selectedShippingId
                      ? "border-brand bg-brand/5"
                      : "border-border bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shippingMethodChoice"
                      value={option.id}
                      checked={option.id === selectedShippingId}
                      onChange={() => setSelectedShippingId(option.id)}
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
                </label>
              ))}
            </div>
          </div>

          {!selectedShipping && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Please choose a shipping method before placing your order.
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || !selectedShipping}
            className="w-full rounded-lg bg-brand py-3 font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isPending ? "Placing order..." : "Place order"}
          </button>
        </form>

        <aside className="bg-surface-card border border-border rounded-xl p-6 h-fit space-y-5">
          <h2 className="text-xl font-semibold">Order summary</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-lg object-cover bg-white"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Qty {item.quantity} x ${item.price.toFixed(2)}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
