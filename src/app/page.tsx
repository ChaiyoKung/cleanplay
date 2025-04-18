import Link from "next/link";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import ProfileDropdown from "./_components/profile-dropdown";
import SignInButton from "./_components/sign-in-button";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <header className="sticky top-0 z-10 flex items-center justify-between bg-zinc-950 px-4 py-2">
        <Link href="/">
          <h1 className="text-xl font-bold">
            Clean<span className="text-red-500">Play</span>
          </h1>
        </Link>

        {session === null ? (
          <SignInButton />
        ) : (
          <ProfileDropdown user={session.user} />
        )}
      </header>
    </HydrateClient>
  );
}
