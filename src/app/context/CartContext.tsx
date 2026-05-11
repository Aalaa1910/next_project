"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo } from "react";
import {
  CART_COOKIE_NAME,
  CART_QUERY_KEY,
  CART_STORAGE_KEY,
  CartItem,
  GUEST_CART_KEY,
  GUEST_CART_STORAGE_KEY,
  getCartItemsForUser,
  getCartOwnerKey,
  parseCartItems,
  parseCartStore,
  writeCartItems,
  writeCartStore,
} from "../lib/cart";

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  isReady: boolean;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  return children;
}

export function useCart() {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const userKey = useMemo(
    () => getCartOwnerKey(session?.user?.email),
    [session?.user?.email]
  );
  const activeCartKey = userKey ?? GUEST_CART_KEY;
  const isReady = typeof window !== "undefined" && status !== "loading";

  useEffect(() => {
    if (typeof window === "undefined" || status !== "authenticated" || !userKey) {
      return;
    }

    const guestItems = parseCartItems(
      sessionStorage.getItem(GUEST_CART_STORAGE_KEY)
    );

    if (guestItems.length === 0) return;

    const store = parseCartStore(localStorage.getItem(CART_STORAGE_KEY));
    const currentUserItems = getCartItemsForUser(store, userKey);
    const mergedItems = mergeCartItems(currentUserItems, guestItems);

    store[userKey] = mergedItems;

    const serializedStore = writeCartStore(store);
    localStorage.setItem(CART_STORAGE_KEY, serializedStore);
    sessionStorage.removeItem(GUEST_CART_STORAGE_KEY);
    document.cookie = `${CART_COOKIE_NAME}=${encodeURIComponent(
      serializedStore
    )}; path=/; max-age=31536000; samesite=lax`;

    queryClient.setQueryData([CART_QUERY_KEY, userKey], mergedItems);
    queryClient.setQueryData([CART_QUERY_KEY, GUEST_CART_KEY], []);
  }, [queryClient, status, userKey]);

  const { data: items = [] } = useQuery({
    queryKey: [CART_QUERY_KEY, activeCartKey],
    enabled: isReady,
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async () => readUserCart(userKey),
  });

  const persistCart = useCallback(
    (nextItems: CartItem[]) => {
      if (typeof window === "undefined") return;

      if (!userKey) {
        if (nextItems.length > 0) {
          sessionStorage.setItem(
            GUEST_CART_STORAGE_KEY,
            writeCartItems(nextItems)
          );
        } else {
          sessionStorage.removeItem(GUEST_CART_STORAGE_KEY);
        }

        return;
      }

      const store = parseCartStore(localStorage.getItem(CART_STORAGE_KEY));

      if (nextItems.length > 0) {
        store[userKey] = nextItems;
      } else {
        delete store[userKey];
      }

      const serializedStore = writeCartStore(store);
      localStorage.setItem(CART_STORAGE_KEY, serializedStore);
      document.cookie = `${CART_COOKIE_NAME}=${encodeURIComponent(
        serializedStore
      )}; path=/; max-age=31536000; samesite=lax`;
    },
    [userKey]
  );

  const setItems = useCallback(
    (updater: (currentItems: CartItem[]) => CartItem[]) => {
      const currentItems =
        queryClient.getQueryData<CartItem[]>([CART_QUERY_KEY, activeCartKey]) ?? [];
      const nextItems = updater(currentItems);

      queryClient.setQueryData([CART_QUERY_KEY, activeCartKey], nextItems);
      persistCart(nextItems);
    },
    [activeCartKey, persistCart, queryClient]
  );

  const addToCart = useCallback(
    (product: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.id === product.id);
        const nextQuantity = Math.max(1, Math.trunc(quantity));

        if (existingItem) {
          return currentItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + nextQuantity }
              : item
          );
        }

        return [...currentItems, { ...product, quantity: nextQuantity }];
      });
    },
    [setItems]
  );

  const updateQuantity = useCallback(
    (id: number, quantity: number) => {
      setItems((currentItems) =>
        currentItems.flatMap((item) => {
          if (item.id !== id) return [item];
          if (quantity <= 0) return [];

          return [{ ...item, quantity }];
        })
      );
    },
    [setItems]
  );

  const removeFromCart = useCallback(
    (id: number) => {
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    },
    [setItems]
  );

  const clearCart = useCallback(() => {
    setItems(() => []);
  }, [setItems]);

  return {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isReady,
  } satisfies CartContextType;
}

async function readUserCart(userKey: string | null) {
  if (typeof window === "undefined") return [];

  if (!userKey) {
    return parseCartItems(sessionStorage.getItem(GUEST_CART_STORAGE_KEY));
  }

  const store = parseCartStore(localStorage.getItem(CART_STORAGE_KEY));
  return getCartItemsForUser(store, userKey);
}

function mergeCartItems(currentItems: CartItem[], incomingItems: CartItem[]) {
  const merged = new Map<number, CartItem>();

  for (const item of currentItems) {
    merged.set(item.id, item);
  }

  for (const item of incomingItems) {
    const existing = merged.get(item.id);

    if (existing) {
      merged.set(item.id, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
      continue;
    }

    merged.set(item.id, item);
  }

  return Array.from(merged.values());
}
