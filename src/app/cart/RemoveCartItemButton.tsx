"use client";

type RemoveCartItemButtonProps = {
  onRemove: () => void;
};

export default function RemoveCartItemButton({
  onRemove,
}: RemoveCartItemButtonProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="text-sm font-medium text-red-500 transition hover:text-red-700"
    >
      Remove
    </button>
  );
}
