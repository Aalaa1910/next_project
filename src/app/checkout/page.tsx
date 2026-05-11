import { auth } from "@/auth";
import CheckoutForm from "./CheckoutForm";

type CheckoutPageProps = {
  searchParams: Promise<{ shipping?: string }>;
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const session = await auth();
  const { shipping } = await searchParams;

  return (
    <CheckoutForm
      userName={session?.user?.name ?? ""}
      initialShippingId={shipping}
    />
  );
}
