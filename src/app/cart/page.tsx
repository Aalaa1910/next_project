import CartItemsClient from "./CartItemsClient";
import CartSummary from "./CartSummary";

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <CartItemsClient />
      <CartSummary />
    </div>
  );
}
