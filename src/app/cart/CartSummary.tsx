import Link from "next/link";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import {
  CART_COOKIE_NAME,
  getCartItemsForUser,
  getCartOwnerKey,
  parseCartStore,
} from "../lib/cart";

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    label: "Standard shipping",
    description: "Delivery in 3-5 business days",
    price: 12,
  },
  {
    id: "express",
    label: "Express shipping",
    description: "Delivery in 1-2 business days",
    price: 24,
  },
  {
    id: "pickup",
    label: "Store pickup",
    description: "Collect your order for free",
    price: 0,
  },
] as const;

export default async function CartSummary() {
  const session = await auth();
  const cookieStore = await cookies();
  const serializedStore = cookieStore.get(CART_COOKIE_NAME)?.value;
  const userKey = getCartOwnerKey(session?.user?.email);
  const items = getCartItemsForUser(parseCartStore(serializedStore), userKey);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingOptions = SHIPPING_OPTIONS.map((option) => ({
    ...option,
    price: option.id === "standard" && subtotal >= 100 ? 0 : option.price,
  }));
  const recommendedShipping =
    items.length === 0
      ? { id: "empty", label: "Shipping", price: 0 }
      : shippingOptions[0];
  const total = subtotal + recommendedShipping.price;

  return (
    <aside className="h-fit rounded-2xl border border-border bg-surface-card p-6 space-y-5">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
        <p className="text-sm text-gray-600">
          Review your cart items, see the cost breakdown, and choose your shipping option before proceeding to checkout.
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
          <span>{recommendedShipping.label}</span>
          <span>${recommendedShipping.price.toFixed(2)}</span>
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
          <div
            key={option.id}
            className={`rounded-xl border p-3 ${
              option.id === recommendedShipping.id
                ? "border-brand bg-brand/5"
                : "border-border bg-white"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
              <span className="font-semibold text-gray-900">
                ${option.price.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Link
        href={items.length > 0 ? "/checkout" : "/products"}
        className={`inline-flex w-full justify-center rounded-lg px-5 py-3 font-semibold text-white transition ${
          items.length > 0
            ? "bg-brand hover:bg-brand-hover"
            : "bg-gray-400 hover:bg-gray-500"
        }`}
      >
        {items.length > 0 ? "Proceed to checkout" : "Continue shopping"}
      </Link>
    </aside>
  );
}
