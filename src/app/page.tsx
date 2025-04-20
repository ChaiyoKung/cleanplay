import { auth } from "~/server/auth";
import SignInButton from "./_components/sign-in-button";
import Playlists from "./_components/playlists";

export default async function Home() {
  const session = await auth();

  if (session === null) {
    return (
      <div className="flex items-center justify-center gap-1 rounded-lg border border-zinc-700 px-4 py-8">
        Please <SignInButton /> to view your playlists.
      </div>
    );
  }

  return <Playlists />;
}
