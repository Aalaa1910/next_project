"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/orders", label: "Orders" },
  { href: "/profile", label: "Profile" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex gap-1 list-none">
      {navLinks.map(({ href, label }) => {
        const isActive =
          href === "/"
            ? pathname === "/"
            : pathname.startsWith(href);

        return (
          <li key={href}>
            <Link
              href={href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
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
    </ul>
  );
}
