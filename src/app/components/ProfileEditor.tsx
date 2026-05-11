"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserProfileRecord } from "../lib/account-data";

type ProfileQueryData = {
  profile: UserProfileRecord;
  wishlistCount: number;
  ordersCount: number;
};

type ProfileEditorProps = {
  initialData: ProfileQueryData;
};

async function fetchProfile(): Promise<ProfileQueryData> {
  const response = await fetch("/api/profile", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load profile");
  }

  return response.json();
}

async function updateProfile(
  values: Omit<UserProfileRecord, "email" | "memberSince">
): Promise<UserProfileRecord> {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  const data = (await response.json()) as { profile: UserProfileRecord };
  return data.profile;
}

export default function ProfileEditor({ initialData }: ProfileEditorProps) {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    initialData,
  });

  const [formValues, setFormValues] = useState({
    name: data.profile.name,
    phone: data.profile.phone,
    city: data.profile.city,
    address: data.profile.address,
    bio: data.profile.bio,
  });

  useEffect(() => {
    setFormValues({
      name: data.profile.name,
      phone: data.profile.phone,
      city: data.profile.city,
      address: data.profile.address,
      bio: data.profile.bio,
    });
  }, [data.profile]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData<ProfileQueryData>(["profile"], (current) =>
        current
          ? {
              ...current,
              profile,
            }
          : {
              profile,
              wishlistCount: initialData.wishlistCount,
              ordersCount: initialData.ordersCount,
            }
      );
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate(formValues);
  }

  function updateField(name: keyof typeof formValues, value: string) {
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <section className="rounded-xl border border-border bg-surface-card p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-900">Edit profile</h2>
        <p className="mt-1 text-sm text-gray-600">
          Update your personal information to keep your account up to date.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-gray-700">Name</span>
            <input
              value={formValues.name}
              onChange={(event) => updateField("name", event.target.value)}
              autoComplete="name"
              suppressHydrationWarning
              className="w-full rounded-lg border border-border bg-white px-4 py-3 outline-none focus:border-brand"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-gray-700">Phone</span>
            <input
              value={formValues.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              autoComplete="tel"
              suppressHydrationWarning
              className="w-full rounded-lg border border-border bg-white px-4 py-3 outline-none focus:border-brand"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-gray-700">City</span>
            <input
              value={formValues.city}
              onChange={(event) => updateField("city", event.target.value)}
              autoComplete="address-level2"
              suppressHydrationWarning
              className="w-full rounded-lg border border-border bg-white px-4 py-3 outline-none focus:border-brand"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-gray-700">Address</span>
            <input
              value={formValues.address}
              onChange={(event) => updateField("address", event.target.value)}
              autoComplete="street-address"
              suppressHydrationWarning
              className="w-full rounded-lg border border-border bg-white px-4 py-3 outline-none focus:border-brand"
            />
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm text-gray-700">Bio</span>
          <textarea
            value={formValues.bio}
            onChange={(event) => updateField("bio", event.target.value)}
            rows={4}
            suppressHydrationWarning
            className="w-full rounded-lg border border-border bg-white px-4 py-3 outline-none focus:border-brand"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            suppressHydrationWarning
            className="rounded-lg bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {mutation.isPending ? "Saving..." : "Save changes"}
          </button>

          {mutation.isSuccess ? (
            <p className="text-sm text-green-600">Profile updated successfully.</p>
          ) : null}

          {mutation.isError ? (
            <p className="text-sm text-red-600">Could not save your changes.</p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
