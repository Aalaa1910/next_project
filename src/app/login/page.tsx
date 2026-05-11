"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const isFacebookEnabled =
  process.env.NEXT_PUBLIC_FACEBOOK_ENABLED === "true";

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  return (
    <section className="max-w-md mx-auto bg-surface-card border border-border rounded-xl p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-600">
          Continue with your social account to access your cart and checkout.
        </p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full rounded-lg bg-white text-gray-950 py-3 font-semibold hover:bg-gray-200 transition"
        >
          Continue with Google
        </button>
        {isFacebookEnabled ? (
          <button
            type="button"
            onClick={() => signIn("facebook", { callbackUrl })}
            className="w-full rounded-lg bg-[#1877f2] text-white py-3 font-semibold hover:bg-[#166fe5] transition"
          >
            Continue with Facebook
          </button>
        ) : (
          <p className="rounded-lg border border-border bg-white px-4 py-3 text-sm text-gray-500">
            Facebook login is currently unavailable.
          </p>
        )}
      </div>

      <p className="text-sm text-gray-600 text-center">
        New here?{" "}
        <Link href="/register" className="text-brand hover:text-brand-hover">
          Create an account
        </Link>
      </p>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <section className="max-w-md mx-auto bg-surface-card border border-border rounded-xl p-8">
          <p className="text-gray-600">Loading login...</p>
        </section>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
