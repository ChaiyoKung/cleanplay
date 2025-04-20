"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-zinc-700 px-4 py-8">
      <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
      <button
        className="cursor-pointer rounded-lg bg-zinc-800 px-4 py-2 text-sm font-bold text-zinc-200 hover:bg-zinc-700"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
