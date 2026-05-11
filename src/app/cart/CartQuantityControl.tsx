"use client";

type CartQuantityControlProps = {
  productTitle: string;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export default function CartQuantityControl({
  productTitle,
  quantity,
  onDecrease,
  onIncrease,
}: CartQuantityControlProps) {
  return (
    <div className="flex items-center rounded-full border border-border bg-white">
      <button
        type="button"
        onClick={onDecrease}
        className="px-4 py-2 text-lg font-semibold text-gray-700 transition hover:text-brand"
        aria-label={`Decrease quantity for ${productTitle}`}
      >
        -
      </button>
      <span className="min-w-10 text-center text-sm font-semibold text-gray-900">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className="px-4 py-2 text-lg font-semibold text-gray-700 transition hover:text-brand"
        aria-label={`Increase quantity for ${productTitle}`}
      >
        +
      </button>
    </div>
  );
}
