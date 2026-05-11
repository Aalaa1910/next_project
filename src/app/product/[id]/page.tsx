import type { Metadata } from "next";
import {
  getProduct,
  getProducts,
} from "../../lib/products";
import ProductDetailClient from "./ProductDetailClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  return {
    title: product.title,
    description: product.description.slice(0, 150),
  };
}

export async function generateStaticParams() {
  const products = await getProducts(20);
  return products.map((product) => ({ id: String(product.id) }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  return <ProductDetailClient productId={id} initialProduct={product} />;
}
