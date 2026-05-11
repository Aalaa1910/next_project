import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type WishlistItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  addedAt: string;
};

export type OrderItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

export type OrderRecord = {
  id: string;
  placedAt: string;
  status: "Processing" | "Delivered" | "Cancelled";
  total: number;
  items: OrderItem[];
};

export type UserProfileRecord = {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  bio: string;
  memberSince: string;
};

export type UserAccountRecord = {
  profile: UserProfileRecord;
  wishlist: WishlistItem[];
  orders: OrderRecord[];
};

type AccountStore = Record<string, UserAccountRecord>;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "account-data.json");

async function ensureDataFile() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, JSON.stringify({}, null, 2), "utf8");
  }
}

async function readStore(): Promise<AccountStore> {
  await ensureDataFile();

  try {
    const content = await readFile(DATA_FILE, "utf8");
    return JSON.parse(content) as AccountStore;
  } catch {
    return {};
  }
}

async function writeStore(store: AccountStore) {
  await ensureDataFile();
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

function emptyProfile(email: string, name?: string | null): UserProfileRecord {
  return {
    name: name ?? "ShopNext Customer",
    email,
    phone: "",
    city: "",
    address: "",
    bio: "",
    memberSince: new Date().toISOString(),
  };
}

function emptyAccount(email = "", name?: string | null): UserAccountRecord {
  return {
    profile: emptyProfile(email, name),
    wishlist: [],
    orders: [],
  };
}

export async function getUserAccount(email: string, name?: string | null) {
  const store = await readStore();
  const account = store[email];

  if (!account) {
    return emptyAccount(email, name);
  }

  return {
    ...account,
    profile: {
      ...emptyProfile(email, name),
      ...account.profile,
      email,
    },
  };
}

export async function updateUserProfile(
  email: string,
  profile: Partial<Omit<UserProfileRecord, "email" | "memberSince">>,
  fallbackName?: string | null
) {
  const store = await readStore();
  const account = store[email] ?? emptyAccount(email, fallbackName);

  const nextProfile: UserProfileRecord = {
    ...emptyProfile(email, fallbackName),
    ...account.profile,
    ...profile,
    email,
  };

  store[email] = {
    ...account,
    profile: nextProfile,
  };

  await writeStore(store);

  return nextProfile;
}

export async function addWishlistItem(
  email: string,
  item: Omit<WishlistItem, "addedAt">
) {
  const store = await readStore();
  const account = store[email] ?? emptyAccount(email);

  const alreadyExists = account.wishlist.some(
    (wishlistItem) => wishlistItem.id === item.id
  );

  if (alreadyExists) {
    return {
      added: false,
      wishlist: account.wishlist,
    };
  }

  const nextWishlist = [
    {
      ...item,
      addedAt: new Date().toISOString(),
    },
    ...account.wishlist,
  ];

  store[email] = {
    ...account,
    wishlist: nextWishlist,
  };

  await writeStore(store);

  return {
    added: true,
    wishlist: nextWishlist,
  };
}

export async function addOrder(
  email: string,
  order: Omit<OrderRecord, "id" | "placedAt" | "status">
) {
  const store = await readStore();
  const account = store[email] ?? emptyAccount(email);

  const nextOrder: OrderRecord = {
    id: `ORD-${Date.now()}`,
    placedAt: new Date().toISOString(),
    status: "Processing",
    ...order,
  };

  const nextOrders = [nextOrder, ...account.orders];

  store[email] = {
    ...account,
    orders: nextOrders,
  };

  await writeStore(store);

  return nextOrder;
}
