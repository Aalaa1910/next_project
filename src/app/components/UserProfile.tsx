import { auth } from "@/auth";
import { getUserAccount } from "../lib/account-data";
import ProfileEditor from "./ProfileEditor";

const memberSinceFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default async function UserProfile() {
  const session = await auth();
  const email = session?.user?.email ?? "";
  const account = email ? await getUserAccount(email, session?.user?.name) : null;

  const profileData = account
    ? {
        profile: account.profile,
        wishlistCount: account.wishlist.length,
        ordersCount: account.orders.length,
      }
    : null;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          Review your account details, wishlist activity, and order stats.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface-card p-5">
          <p className="text-sm text-gray-500">Name</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {account?.profile.name ?? session?.user?.name ?? "ShopNext Customer"}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-card p-5">
          <p className="text-sm text-gray-500">Email</p>
          <p className="mt-2 text-lg font-semibold text-gray-900 break-all">
            {account?.profile.email ?? session?.user?.email ?? "Not available"}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-card p-5">
          <p className="text-sm text-gray-500">Member since</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {account?.profile.memberSince
              ? memberSinceFormatter.format(new Date(account.profile.memberSince))
              : "Recently"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface-card p-6">
          <p className="text-sm text-gray-500">Wishlist items</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {profileData?.wishlistCount ?? 0}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Your favorite items,saved for later. Visit your wishlist to view or manage these products.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-card p-6">
          <p className="text-sm text-gray-500">Orders placed</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {profileData?.ordersCount ?? 0}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            View your order history and track the status of your recent purchases.
          </p>
        </div>
      </div>

      {profileData ? <ProfileEditor initialData={profileData} /> : null}

      <div className="rounded-xl border border-border bg-surface-card p-6">
        <h2 className="text-xl font-semibold text-gray-900">Wishlist preview</h2>
        {account?.wishlist.length ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {account.wishlist.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-white p-3"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-16 w-16 rounded-lg object-cover bg-surface"
                />
                <div className="min-w-0">
                  <p className="font-semibold line-clamp-2">{item.title}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {item.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-600">
            You have not saved any products yet.
          </p>
        )}
      </div>
    </section>
  );
}
