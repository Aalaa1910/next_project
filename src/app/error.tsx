"use client";

export default function Error({
 
  reset, error,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-2xl font-bold text-red-500">Something went wrong!</h2>
      <p className="text-gray-600">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition"
      >
        Try again
      </button>
    </div>
  );
}
