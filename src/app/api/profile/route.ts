import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserAccount, updateUserProfile } from "../../lib/account-data";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const account = await getUserAccount(email, session?.user?.name);

  return NextResponse.json({
    profile: account.profile,
    wishlistCount: account.wishlist.length,
    ordersCount: account.orders.length,
  });
}

export async function PATCH(request: Request) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
    phone?: string;
    city?: string;
    address?: string;
    bio?: string;
  };

  const profile = await updateUserProfile(
    email,
    {
      name: body.name?.trim() ?? "",
      phone: body.phone?.trim() ?? "",
      city: body.city?.trim() ?? "",
      address: body.address?.trim() ?? "",
      bio: body.bio?.trim() ?? "",
    },
    session?.user?.name
  );

  return NextResponse.json({ profile });
}
