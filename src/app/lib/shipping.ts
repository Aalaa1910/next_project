export const SHIPPING_OPTIONS = [
  {
    id: "standard",
    label: "Standard shipping",
    description: "Delivery in 3-5 business days",
    price: 12,
  },
  {
    id: "express",
    label: "Express shipping",
    description: "Delivery in 1-2 business days",
    price: 24,
  },
  {
    id: "pickup",
    label: "Store pickup",
    description: "Collect your order for free",
    price: 0,
  },
] as const;

export type ShippingOption = (typeof SHIPPING_OPTIONS)[number];
export type ShippingOptionId = ShippingOption["id"];

export function getShippingOptions(subtotal: number): ShippingOption[] {
  return SHIPPING_OPTIONS.map((option) => ({
    ...option,
    price: option.id === "standard" && subtotal >= 100 ? 0 : option.price,
  }));
}

export function getShippingOptionById(
  subtotal: number,
  shippingId?: string
): ShippingOption | null {
  if (!shippingId) {
    return null;
  }

  return (
    getShippingOptions(subtotal).find((option) => option.id === shippingId) ??
    null
  );
}
