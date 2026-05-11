export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  image?: string;
  category: string;
  rating?: number;
  thumbnail?: string;
  brand?: string;
  stock?: number;
};

export type Category = {
  slug: string;
  name: string;
  url?: string;
};

export type CartProduct = {
  id: number;
  title: string;
  price: number;
  image: string;
};

type ProductsResponse = {
  products: Product[];
};

type CategoryResponse = Array<Category | string>;

export type ProductSort =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "title-asc";

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1001,
    title: "Aurora Desk Lamp",
    description:
      "A compact LED desk lamp with warm and cool light modes for home offices and study corners.",
    price: 49,
    images: ["https://picsum.photos/seed/aurora-lamp/640/640"],
    thumbnail: "https://picsum.photos/seed/aurora-lamp/640/640",
    category: "home-decoration",
    rating: 4.6,
    brand: "LumaNest",
    stock: 18,
  },
  {
    id: 1002,
    title: "Summit Travel Backpack",
    description:
      "A lightweight everyday backpack with padded straps, laptop sleeve, and water-resistant fabric.",
    price: 89,
    images: ["https://picsum.photos/seed/summit-backpack/640/640"],
    thumbnail: "https://picsum.photos/seed/summit-backpack/640/640",
    category: "mens-shirts",
    rating: 4.4,
    brand: "Northway",
    stock: 24,
  },
  {
    id: 1003,
    title: "Cedar Ceramic Vase",
    description:
      "Minimal ceramic vase with a matte finish designed to elevate shelves, entryways, and dining tables.",
    price: 34,
    images: ["https://picsum.photos/seed/cedar-vase/640/640"],
    thumbnail: "https://picsum.photos/seed/cedar-vase/640/640",
    category: "home-decoration",
    rating: 4.2,
    brand: "Atelier Home",
    stock: 30,
  },
  {
    id: 1004,
    title: "Pulse Wireless Headphones",
    description:
      "Over-ear wireless headphones with active noise reduction and up to 30 hours of battery life.",
    price: 129,
    images: ["https://picsum.photos/seed/pulse-headphones/640/640"],
    thumbnail: "https://picsum.photos/seed/pulse-headphones/640/640",
    category: "smartphones",
    rating: 4.8,
    brand: "Pulse Audio",
    stock: 12,
  },
  {
    id: 1005,
    title: "Drift Running Shoes",
    description:
      "Breathable running shoes with cushioned soles for daily walks, gym sessions, and casual wear.",
    price: 95,
    images: ["https://picsum.photos/seed/drift-shoes/640/640"],
    thumbnail: "https://picsum.photos/seed/drift-shoes/640/640",
    category: "mens-shoes",
    rating: 4.5,
    brand: "Motion Lab",
    stock: 20,
  },
  {
    id: 1006,
    title: "Linen Lounge Set",
    description:
      "Two-piece relaxed lounge set made from soft linen blend fabric for comfortable all-day wear.",
    price: 72,
    images: ["https://picsum.photos/seed/linen-lounge/640/640"],
    thumbnail: "https://picsum.photos/seed/linen-lounge/640/640",
    category: "womens-dresses",
    rating: 4.3,
    brand: "Willow & Co.",
    stock: 16,
  },
  {
    id: 1007,
    title: "Nimbus Tablet Stand",
    description:
      "Adjustable aluminum stand for tablets and e-readers with fold-flat portability for travel.",
    price: 27,
    images: ["https://picsum.photos/seed/nimbus-stand/640/640"],
    thumbnail: "https://picsum.photos/seed/nimbus-stand/640/640",
    category: "laptops",
    rating: 4.1,
    brand: "Nimbus",
    stock: 40,
  },
  {
    id: 1008,
    title: "Botanical Skin Care Kit",
    description:
      "A daily skin care trio with cleanser, serum, and moisturizer formulated with botanical extracts.",
    price: 58,
    images: ["https://picsum.photos/seed/botanical-kit/640/640"],
    thumbnail: "https://picsum.photos/seed/botanical-kit/640/640",
    category: "skincare",
    rating: 4.7,
    brand: "Verde Ritual",
    stock: 22,
  },
];

const FALLBACK_CATEGORIES: Category[] = Array.from(
  new Map(
    FALLBACK_PRODUCTS.map((product) => [
      product.category,
      {
        slug: product.category,
        name: product.category.replace(/-/g, " "),
      },
    ])
  ).values()
);

export async function getProducts(limit = 100): Promise<Product[]> {
  const data = await fetchJson<ProductsResponse>(
    `https://dummyjson.com/products?limit=${limit}`
  );

  if (!data?.products?.length) {
    return FALLBACK_PRODUCTS.slice(0, limit);
  }

  return data.products;
}

export async function getProduct(id: number | string): Promise<Product> {
  const normalizedId = Number(id);

  const data = await fetchJson<Product>(`https://dummyjson.com/products/${id}`);

  if (data) {
    return data;
  }

  const fallbackProduct = FALLBACK_PRODUCTS.find(
    (product) => product.id === normalizedId
  );

  if (fallbackProduct) {
    return fallbackProduct;
  }

  throw new Error("Product not found");
}

export async function getCategories(): Promise<Category[]> {
  const data = await fetchJson<CategoryResponse>(
    "https://dummyjson.com/products/categories"
  );

  if (!data?.length) {
    return FALLBACK_CATEGORIES;
  }

  return data.map((category) =>
    typeof category === "string"
      ? {
          slug: category,
          name: category.replace(/-/g, " "),
        }
      : category
  );
}

export function toCartProduct(product: Product): CartProduct {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.thumbnail ?? product.image ?? product.images[0],
  };
}

export function getFeaturedProducts(products: Product[]) {
  return [...products]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 4);
}

export function formatCategoryLabel(category?: string) {
  if (!category) return null;

  return decodeURIComponent(category)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function filterAndSortProducts(
  products: Product[],
  {
    category,
    sort = "featured",
  }: {
    category?: string;
    sort?: ProductSort;
  }
) {
  const normalizedCategory = category?.toLowerCase();

  const filtered =
    !normalizedCategory || normalizedCategory === "all"
      ? products
      : products.filter(
          (product) => product.category.toLowerCase() === normalizedCategory
        );

  const sorted = [...filtered];

  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    case "title-asc":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }

  return sorted;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`Request failed for ${url} with status ${res.status}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.warn(`Request failed for ${url}. Using fallback data instead.`, error);
    return null;
  }
}
