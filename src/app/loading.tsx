import { generateEmptyArray } from "~/utils";

export default function Loading() {
  const placeholders = generateEmptyArray(6);

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {placeholders.map((_, index) => (
        <div key={index}>
          <div className="relative mb-2">
            <div className="absolute -top-2 right-0 left-0 -z-[2] mx-4 h-2 animate-pulse rounded-tl-lg rounded-tr-lg border border-zinc-950 bg-zinc-800"></div>
            <div className="absolute -top-1 right-0 left-0 -z-[1] mx-2 h-2 animate-pulse rounded-tl-lg rounded-tr-lg border border-zinc-950 bg-zinc-600"></div>
            <div className="aspect-video rounded-lg border border-zinc-950 bg-zinc-600"></div>
            <div className="absolute right-1.5 bottom-1.5 flex h-4 w-16 animate-pulse items-center justify-center gap-1 rounded-sm bg-zinc-800/75 px-1 text-xs"></div>
          </div>
          <div className="h-4 max-w-48 rounded-sm bg-zinc-600"></div>
        </div>
      ))}
    </div>
  );
}
