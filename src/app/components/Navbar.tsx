"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { items, isReady } = useCart();

  const totalItems = isReady
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <nav className="sticky top-0 z-20 border-b border-border bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          ShopNext
        </Link>

        <ul className="flex flex-wrap gap-1 list-none items-center">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-surface-card text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-surface-card"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}

          {session?.user && (
            <>
              <li>
                <Link
                  href="/orders"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith("/orders")
                      ? "bg-surface-card text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-surface-card"
                  }`}
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith("/profile")
                      ? "bg-surface-card text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-surface-card"
                  }`}
                >
                  Profile
                </Link>
              </li>
            </>
          )}

          <li>
            <Link
              href="/cart"
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === "/cart"
                  ? "bg-surface-card text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-surface-card"
              }`}
            >
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </li>

          <li>
            {status === "loading" ? (
              <span className="px-4 py-2 text-sm text-gray-500">...</span>
            ) : session?.user ? (
              <Link
                href="/signout"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-surface-card transition-all duration-200"
              >
                Sign out
              </Link>
            ) : (
              <div className="flex gap-1">
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === "/login"
                      ? "bg-surface-card text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-surface-card"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === "/register"
                      ? "bg-brand text-white"
                      : "bg-brand/90 text-white hover:bg-brand-hover"
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
