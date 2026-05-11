"use client";

type ProductQuantitySelectorProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export default function ProductQuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
}: ProductQuantitySelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">Quantity</p>
      <div className="inline-flex items-center rounded-full border border-border bg-white">
        <button
          type="button"
          onClick={onDecrease}
          className="px-4 py-2 text-lg font-semibold text-gray-700 transition hover:text-brand"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="min-w-12 text-center text-sm font-semibold text-gray-900">
          {quantity}
        </span>
        <button
          type="button"
          onClick={onIncrease}
          className="px-4 py-2 text-lg font-semibold text-gray-700 transition hover:text-brand"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
}
