"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function SignOutPage() {
  const { data: session, status } = useSession();

  return (
    <section className="max-w-md mx-auto bg-surface-card border border-border rounded-xl p-8 space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Sign out</h1>
        <p className="text-gray-600">
          {session?.user?.email
            ? `Signed in as ${session.user.email}.`
            : "End your current session."}
        </p>
      </div>

      {status === "authenticated" ? (
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full rounded-lg bg-brand text-white py-3 font-semibold hover:bg-brand-hover transition"
        >
          Sign out
        </button>
      ) : (
        <Link
          href="/login"
          className="block w-full rounded-lg bg-brand text-white py-3 font-semibold hover:bg-brand-hover transition"
        >
          Login
        </Link>
      )}
    </section>
  );
}
