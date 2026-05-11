import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { Product, toCartProduct } from "../lib/products";
import DescriptionToggle from "./DescriptionToggle";
import WishlistButton from "./WishlistButton";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.thumbnail ?? product.image ?? product.images[0];

  return (
    <article className="border border-border rounded-lg p-4 flex flex-col gap-3 bg-surface-card hover:border-brand/60 transition">
      <Link href={`/product/${product.id}`} className="block">
        <img
          src={image}
          alt={product.title}
          className="w-full h-48 object-cover rounded bg-white"
        />
      </Link>
      <div className="space-y-1">
        <Link href={`/product/${product.id}`} className="block">
          <h2 className="font-semibold text-sm line-clamp-2 hover:text-brand transition">
            {product.title}
          </h2>
        </Link>
        <p className="text-gray-500 text-xs capitalize">{product.category}</p>
      </div>
      <DescriptionToggle text={product.description} />
      <p className="font-bold">${product.price}</p>
      <WishlistButton
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          image,
          category: product.category,
        }}
      />
      <AddToCartButton product={toCartProduct(product)} />
    </article>
  );
}
