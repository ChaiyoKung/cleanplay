import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/server";

export async function Playlists() {
  const response = await api.playlist.list();

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {response.items.map((playlist) => (
        <Link key={playlist.id} href={`/playlists/${playlist.id}`}>
          <div className="relative mb-2">
            <div className="absolute -top-2 right-0 left-0 -z-[2] mx-4 h-2 rounded-tl-lg rounded-tr-lg border border-zinc-950 bg-zinc-800"></div>
            <div className="absolute -top-1 right-0 left-0 -z-[1] mx-2 h-2 rounded-tl-lg rounded-tr-lg border border-zinc-950 bg-zinc-600"></div>
            <Image
              src={playlist.snippet.thumbnails.maxres.url}
              alt={playlist.snippet.title}
              width={playlist.snippet.thumbnails.maxres.width}
              height={playlist.snippet.thumbnails.maxres.height}
              className="rounded-lg border border-zinc-950"
            />
            <div className="absolute right-1.5 bottom-1.5 flex items-center justify-center gap-1 rounded-sm bg-zinc-800/75 px-1 text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-2.5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                  clipRule="evenodd"
                />
              </svg>
              {playlist.contentDetails.itemCount} videos
            </div>
          </div>
          <h2 className="font-bold">{playlist.snippet.title}</h2>
        </Link>
      ))}
    </div>
  );
}

export default Playlists;
