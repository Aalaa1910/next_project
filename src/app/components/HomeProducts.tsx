import FeaturedProducts from "./FeaturedProducts";
import { getProducts } from "../lib/products";

export default async function HomeProducts() {
  const products = await getProducts(24);

  return <FeaturedProducts initialProducts={products} />;
}
