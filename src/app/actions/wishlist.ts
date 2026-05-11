"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { addWishlistItem } from "../lib/account-data";

type WishlistActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function addToWishlistAction(
  _prevState: WishlistActionState,
  formData: FormData
): Promise<WishlistActionState> {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return {
      status: "error",
      message: "Please sign in to save products to your wishlist.",
    };
  }

  const id = Number(formData.get("id"));
  const title = String(formData.get("title") ?? "");
  const price = Number(formData.get("price"));
  const image = String(formData.get("image") ?? "");
  const category = String(formData.get("category") ?? "");

  if (!id || !title || !image || !category || Number.isNaN(price)) {
    return {
      status: "error",
      message: "This product could not be added right now.",
    };
  }

  const result = await addWishlistItem(email, {
    id,
    title,
    price,
    image,
    category,
  });

  revalidatePath("/profile");
  revalidatePath("/products");
  revalidatePath(`/product/${id}`);

  return result.added
    ? {
        status: "success",
        message: "Saved to your wishlist.",
      }
    : {
        status: "success",
        message: "Already saved in your wishlist.",
      };
}
