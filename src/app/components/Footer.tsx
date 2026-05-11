"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const shopLinks = [
  { href: "/products", label: "All Products" },
  { href: "/products?sort=featured", label: "Featured" },
  { href: "/cart", label: "Shopping Cart" },
  { href: "/checkout", label: "Checkout" },
];

const accountLinks = [
  { href: "/profile", label: "My Profile" },
  { href: "/orders", label: "Order History" },
  { href: "/login", label: "Sign In" },
  { href: "/register", label: "Create Account" },
];

const helpLinks = [
  { href: "/products?category=smartphones", label: "Electronics" },
  { href: "/products?category=womens-dresses", label: "Fashion" },
  { href: "/products?category=home-decoration", label: "Home Decor" },
  { href: "/products?category=skincare", label: "Beauty" },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <footer className="mt-16 border-t border-border bg-[linear-gradient(180deg,#fffdf9_0%,#f5efe6_100%)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <Link href="/" className="inline-flex text-2xl font-bold text-gray-900">
            ShopNext
          </Link>
          <p className="max-w-sm text-sm leading-7 text-gray-600">
            Discover electronics, fashion, beauty, and lifestyle picks in one
            modern shopping experience designed to feel simple and polished.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            <span className="rounded-full border border-border bg-white px-3 py-1">
              Fast checkout
            </span>
            <span className="rounded-full border border-border bg-white px-3 py-1">
              Curated products
            </span>
            <span className="rounded-full border border-border bg-white px-3 py-1">
              Secure account area
            </span>
          </div>
        </div>

        <FooterLinks title="Shop" links={shopLinks} />
        <FooterLinks title="Account" links={accountLinks} />
        <FooterLinks title="Explore" links={helpLinks} />
      </div>

      <div className="border-t border-border/80 bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2024 ShopNext. Built for a modern e-commerce experience.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="transition hover:text-brand">
              Browse catalog
            </Link>
            <Link href="/cart" className="transition hover:text-brand">
              View cart
            </Link>
            <Link href="/profile" className="transition hover:text-brand">
              Account
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
        {title}
      </h2>
      <ul className="space-y-3 text-sm text-gray-600">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="transition hover:text-brand">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
