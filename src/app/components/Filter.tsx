"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Category, ProductSort, formatCategoryLabel } from "../lib/products";

const sortOptions: Array<{ label: string; value: ProductSort }> = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating-desc" },
  { label: "Title: A to Z", value: "title-asc" },
];

type FilterProps = {
  categories: Category[];
  currentCategory?: string;
  currentSort?: ProductSort;
};

export default function Filter({
  categories,
  currentCategory = "all",
  currentSort = "featured",
}: FilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleFilter(category: string) {
    const params = new URLSearchParams(searchParams);
    params.delete("page");

    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  function handleSort(sort: ProductSort) {
    const params = new URLSearchParams(searchParams);
    params.delete("page");

    if (sort === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-card p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Filter products</h2>
          <p className="text-sm text-gray-600">
            Use filters to quickly find products that match your preferences.
          </p>
        </div>

        <label className="flex items-center gap-3 text-sm text-gray-700">
          <span>Sort by</span>
          <select
            value={currentSort}
            onChange={(event) => handleSort(event.target.value as ProductSort)}
            className="rounded-lg border border-border bg-white px-3 py-2 outline-none focus:border-brand"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentCategory === "all"
              ? "bg-brand text-white"
              : "bg-surface-card border border-border text-gray-700 hover:bg-surface-hover"
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            type="button"
            key={category.slug}
            onClick={() => handleFilter(category.slug)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
              currentCategory === category.slug
                ? "bg-brand text-white"
                : "bg-surface-card border border-border text-gray-700 hover:bg-surface-hover"
            }`}
          >
            {formatCategoryLabel(category.slug) ?? category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
