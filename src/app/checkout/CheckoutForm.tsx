"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useRef } from "react";
import { placeOrderAction } from "../actions/checkout";
import { useCart } from "../context/CartContext";

type CheckoutFormProps = {
  userName: string;
};

type CheckoutActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialCheckoutState: CheckoutActionState = {
  status: "idle",
  message: "",
};

export default function CheckoutForm({ userName }: CheckoutFormProps) {
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
  const shipping = subtotal > 0 ? 12 : 0;
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

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-brand py-3 font-semibold text-white hover:bg-brand-hover transition"
          >
            {isPending ? "Placing order..." : "Place order"}
          </button>
        </form>

        <aside className="bg-surface-card border border-border rounded-xl p-6 h-fit space-y-5">
          <h2 className="text-xl font-semibold">Order summary</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.title}
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
