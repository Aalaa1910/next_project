"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { addOrder, OrderItem } from "../lib/account-data";

type CheckoutActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function placeOrderAction(
  _prevState: CheckoutActionState,
  formData: FormData
): Promise<CheckoutActionState> {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return {
      status: "error",
      message: "Please sign in before placing an order.",
    };
  }

  const rawItems = String(formData.get("items") ?? "[]");
  const total = Number(formData.get("total"));
  const shippingMethod = String(formData.get("shippingMethod") ?? "");

  let items: OrderItem[] = [];

  try {
    items = JSON.parse(rawItems) as OrderItem[];
  } catch {
    return {
      status: "error",
      message: "We could not read your cart items.",
    };
  }

  if (!items.length || Number.isNaN(total) || total <= 0) {
    return {
      status: "error",
      message: "Your order is empty.",
    };
  }

  if (!shippingMethod) {
    return {
      status: "error",
      message: "Please choose a shipping method.",
    };
  }

  await addOrder(email, {
    total,
    items,
  });

  revalidatePath("/orders");
  revalidatePath("/profile");

  return {
    status: "success",
    message: "Order placed successfully.",
  };
}
