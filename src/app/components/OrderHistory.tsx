import { auth } from "@/auth";
import { getUserAccount } from "../lib/account-data";

export default async function OrderHistory() {
  const session = await auth();
  const email = session?.user?.email ?? "";
  const account = email ? await getUserAccount(email, session?.user?.name) : null;
  const orders = account?.orders ?? [];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="mt-2 text-sm text-gray-600">
          Review your past orders, track their status, and see details of each purchase.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface-card p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            No orders yet
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Once a checkout flow stores orders for this account, they will
            appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-xl border border-border bg-surface-card p-6"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {new Date(order.placedAt).toLocaleDateString()}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 border border-border">
                    {order.status}
                  </span>
                  <span className="text-lg font-bold text-brand">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.id}`} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-16 w-16 rounded-lg object-cover bg-white"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold line-clamp-2">{item.title}</p>
                      <p className="text-sm text-gray-600">
                        Qty {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
