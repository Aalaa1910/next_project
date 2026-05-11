import ProductCard from "./ProductCard";
import {
  ProductSort,
  filterAndSortProducts,
  getProducts,
} from "../lib/products";

export default async function ProductList({
  category,
  sort,
}: {
  category?: string;
  sort?: ProductSort;
}) {
  const products = await getProducts();
  const filtered = filterAndSortProducts(products, { category, sort });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filtered.length === 0 ? (
        <p className="col-span-full text-gray-600">No products found.</p>
      ) : (
        filtered.map((p) => <ProductCard key={p.id} product={p} />)
      )}
    </div>
  );
}
