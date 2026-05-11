import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import HomeCategories from "./components/HomeCategories";
import HomeProducts from "./components/HomeProducts";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to ShopNext",
};

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(135deg,#f6f1e8_0%,#fffdf9_45%,#f4efe6_100%)] px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
        <div className="absolute -right-10 top-8 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-orange-200/30 blur-2xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="inline-flex w-fit items-center rounded-full border border-brand/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              ShopNext Collection
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Discover <span className="text-brand">Amazing</span>
                <br />
                Products
              </h1>

              <p className="max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
                Your one-stop shop for electronics, fashion, jewelry, and more.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-xl bg-brand px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-hover"
              >
                Browse Products
              </Link>
              <Link
                href="/products"
                className="rounded-xl border border-border bg-white/90 px-6 py-3 font-semibold text-gray-700 transition-all hover:border-brand hover:text-brand"
              >
                View Categories
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 border-t border-gray-200/80 pt-5 text-sm text-gray-600">
              <div>
                <p className="text-2xl font-bold text-gray-900">200+</p>
                <p>Curated products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Top</p>
                <p>Electronics and fashion</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Fast</p>
                <p>Checkout experience</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px]">
            <div className="absolute inset-x-8 top-0 h-16 rounded-full bg-brand/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gray-900 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
                alt="Fashion and shopping products arranged for an online store"
                className="h-[420px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05)_0%,rgba(15,23,42,0.45)_100%)]" />
            </div>

            <div className="absolute -left-4 bottom-8 rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:-left-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Best Sellers
              </p>
              <p className="mt-2 text-xl font-bold text-gray-900">Tech + Style</p>
              <p className="mt-1 max-w-[180px] text-sm leading-6 text-gray-600">
                Discover standout picks across electronics, fashion, and more.
              </p>
            </div>

            <div className="absolute -right-2 top-6 rounded-[1.5rem] border border-gray-200 bg-[#efe4d4] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:right-[-24px]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Fresh Arrivals
              </p>
              <p className="mt-2 text-xl font-bold text-gray-900">Shop the drop</p>
              <p className="mt-1 max-w-[170px] text-sm leading-6 text-gray-700">
                New pieces added for home, beauty, and everyday essentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<Loading />}>
        <HomeProducts />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <HomeCategories />
      </Suspense>
    </div>
  );
}
