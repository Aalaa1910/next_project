import type { Metadata } from "next";
import OrderHistory from "../components/OrderHistory";

export const metadata: Metadata = {
  title: "Orders",
  description: "View your ShopNext order history",
};

export default function OrdersPage() {
  return <OrderHistory />;
}
