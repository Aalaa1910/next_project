"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const isFacebookEnabled =
  process.env.NEXT_PUBLIC_FACEBOOK_ENABLED === "true";

function RegisterContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  return (
    <section className="max-w-md mx-auto bg-surface-card border border-border rounded-xl p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Register</h1>
        <p className="text-gray-600">
          Create your account with Google or Facebook. Your profile is provided
          by the selected provider.
        </p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full rounded-lg bg-white text-gray-950 py-3 font-semibold hover:bg-gray-200 transition"
        >
          Sign up with Google
        </button>
        {isFacebookEnabled ? (
          <button
            type="button"
            onClick={() => signIn("facebook", { callbackUrl })}
            className="w-full rounded-lg bg-[#1877f2] text-white py-3 font-semibold hover:bg-[#166fe5] transition"
          >
            Sign up with Facebook
          </button>
        ) : (
          <p className="rounded-lg border border-border bg-white px-4 py-3 text-sm text-gray-500">
            Facebook sign up is currently unavailable.
          </p>
        )}
      </div>

      <p className="text-sm text-gray-600 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-brand hover:text-brand-hover">
          Login
        </Link>
      </p>
    </section>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <section className="max-w-md mx-auto bg-surface-card border border-border rounded-xl p-8">
          <p className="text-gray-600">Loading registration...</p>
        </section>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
