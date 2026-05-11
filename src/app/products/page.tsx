import type { Metadata } from "next";
import { Suspense } from "react";
import ProductList from "../components/ProductList";
import Filter from "../components/Filter";
import {
  ProductSort,
  formatCategoryLabel,
  getCategories,
} from "../lib/products";
import Loading from "../loading";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all products on ShopNext",
};

type Props = {
  searchParams: Promise<{ category?: string; sort?: ProductSort; page?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { category, sort, page } = await searchParams;
  const categories = await getCategories();
  const categoryLabel = formatCategoryLabel(category);
  const currentPage = Number.parseInt(page ?? "1", 10);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {categoryLabel ? `${categoryLabel} Products` : "All Products"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Explore our full collection of high-quality products tailored to your needs.
        </p>
      </div>

      <Suspense fallback={<Loading />}>
        <Filter
          categories={categories}
          currentCategory={category ?? "all"}
          currentSort={sort ?? "featured"}
        />
        <ProductList
          category={category}
          sort={sort}
          page={Number.isNaN(currentPage) ? 1 : currentPage}
        />
      </Suspense>
    </div>
  );
}
