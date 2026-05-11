export type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

export type CartStore = Record<string, CartItem[]>;

export const CART_QUERY_KEY = "cart";
export const CART_COOKIE_NAME = "shopnext-cart";
export const CART_STORAGE_KEY = "shopnext-cart";
export const GUEST_CART_KEY = "guest";
export const GUEST_CART_STORAGE_KEY = "shopnext-guest-cart";

export function getCartOwnerKey(userEmail?: string | null) {
  return userEmail?.trim().toLowerCase() || null;
}

export function parseCartStore(value?: string | null): CartStore {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).map(([key, items]) => [
        key,
        Array.isArray(items)
          ? items.filter(isCartItem).map((item) => ({
              ...item,
              quantity: Math.max(1, Math.trunc(item.quantity)),
            }))
          : [],
      ])
    );
  } catch {
    return {};
  }
}

export function getCartItemsForUser(store: CartStore, userKey: string) {
  return store[userKey] ?? [];
}

export function writeCartStore(store: CartStore) {
  return JSON.stringify(store);
}

export function parseCartItems(value?: string | null): CartItem[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCartItem).map((item) => ({
      ...item,
      quantity: Math.max(1, Math.trunc(item.quantity)),
    }));
  } catch {
    return [];
  }
}

export function writeCartItems(items: CartItem[]) {
  return JSON.stringify(items);
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<CartItem>;

  return (
    typeof item.id === "number" &&
    typeof item.title === "string" &&
    typeof item.price === "number" &&
    typeof item.image === "string" &&
    typeof item.quantity === "number"
  );
}
