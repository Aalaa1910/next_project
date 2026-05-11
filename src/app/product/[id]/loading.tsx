export default function ProductDetailsLoading() {
  return (
    <div className="space-y-8">
      <div className="h-5 w-32 animate-pulse rounded bg-surface-card" />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-border bg-surface-card p-10">
          <div className="h-64 w-full animate-pulse rounded-xl bg-white" />
        </div>

        <div className="space-y-4">
          <div className="h-6 w-24 animate-pulse rounded bg-surface-card" />
          <div className="h-10 w-4/5 animate-pulse rounded bg-surface-card" />
          <div className="h-5 w-32 animate-pulse rounded bg-surface-card" />
          <div className="h-10 w-28 animate-pulse rounded bg-surface-card" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-surface-card" />
            <div className="h-4 w-full animate-pulse rounded bg-surface-card" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-surface-card" />
          </div>
          <div className="h-11 w-full animate-pulse rounded-lg bg-surface-card" />
          <div className="h-11 w-full animate-pulse rounded-lg bg-surface-card" />
        </div>
      </div>
    </div>
  );
}
