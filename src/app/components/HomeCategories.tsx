import Link from "next/link";
import { getCategories } from "../lib/products";

export default async function HomeCategories() {
  const categories = (await getCategories()).slice(0, 8);

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Shop by category</h2>
          <p className="text-gray-600 text-sm mt-1">
            Browse the departments with the freshest picks.
          </p>
        </div>
        <Link href="/products" className="text-sm text-brand hover:text-brand-hover">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${encodeURIComponent(category.slug)}`}
            className="bg-surface-card border border-border rounded-lg p-5 font-semibold capitalize hover:border-brand hover:text-brand transition"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
