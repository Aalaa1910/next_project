import Link from "next/link";
import ProductCard from "./ProductCard";
import {
  ProductSort,
  filterAndSortProducts,
  getProducts,
} from "../lib/products";

const PRODUCTS_PER_PAGE = 12;

type ProductListProps = {
  category?: string;
  sort?: ProductSort;
  page?: number;
};

export default async function ProductList({
  category,
  sort,
  page = 1,
}: ProductListProps) {
  const products = await getProducts();
  const filtered = filterAndSortProducts(products, { category, sort });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filtered.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  const createPageHref = (nextPage: number) => {
    const params = new URLSearchParams();

    if (category && category !== "all") {
      params.set("category", category);
    }

    if (sort && sort !== "featured") {
      params.set("sort", sort);
    }

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    }

    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.length === 0 ? (
          <p className="col-span-full text-gray-600">No products found.</p>
        ) : (
          paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {filtered.length > 0 && totalPages > 1 && (
        <nav
          aria-label="Products pagination"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <Link
            href={createPageHref(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
              currentPage === 1
                ? "pointer-events-none border-border bg-gray-100 text-gray-400"
                : "border-border bg-white text-gray-700 hover:border-brand hover:text-brand"
            }`}
          >
            Previous
          </Link>

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;

            return (
              <Link
                key={pageNumber}
                href={createPageHref(pageNumber)}
                aria-current={pageNumber === currentPage ? "page" : undefined}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  pageNumber === currentPage
                    ? "bg-brand text-white"
                    : "border border-border bg-white text-gray-700 hover:border-brand hover:text-brand"
                }`}
              >
                {pageNumber}
              </Link>
            );
          })}

          <Link
            href={createPageHref(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
              currentPage === totalPages
                ? "pointer-events-none border-border bg-gray-100 text-gray-400"
                : "border-border bg-white text-gray-700 hover:border-brand hover:text-brand"
            }`}
          >
            Next
          </Link>
        </nav>
      )}
    </div>
  );
}
