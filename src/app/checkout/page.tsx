import { auth } from "@/auth";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const session = await auth();

  return <CheckoutForm userName={session?.user?.name ?? ""} />;
}
