"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";

export interface ProfileDropdownProps {
  user: Session["user"];
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const { name, image, email } = user;

  const profileImageButton = image ? (
    <MenuButton className="cursor-pointer overflow-hidden rounded-full bg-zinc-600">
      <Image src={image} alt="User profile picture" width={32} height={32} />
    </MenuButton>
  ) : (
    <MenuButton className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-zinc-600 hover:border-zinc-800 hover:bg-zinc-800">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1}
        stroke="currentColor"
        className="m-1 size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    </MenuButton>
  );

  const profileImageDisplay = image ? (
    <Image
      src={image}
      alt="User profile picture"
      width={40}
      height={40}
      className="rounded-full bg-zinc-600"
    />
  ) : (
    <div className="flex items-center justify-center overflow-hidden rounded-full border border-zinc-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1}
        stroke="currentColor"
        className="m-1 size-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    </div>
  );

  return (
    <Menu>
      {profileImageButton}

      <MenuItems anchor="bottom end" className="z-20 rounded-xl bg-zinc-800">
        <MenuItem>
          <div className="flex gap-4 p-4">
            <div>{profileImageDisplay}</div>
            <div>
              <h2 className="text-lg font-semibold">{name}</h2>
              <p className="text-sm text-zinc-400">{email}</p>
            </div>
          </div>
        </MenuItem>
        <hr className="border-zinc-600" />
        <div className="h-2" />
        <MenuItem>
          <button
            onClick={() => signOut()}
            className="flex w-full cursor-pointer items-center gap-4 px-4 py-2 hover:bg-zinc-700"
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
            </div>
            <div>Sign out</div>
          </button>
        </MenuItem>
        <div className="h-2" />
      </MenuItems>
    </Menu>
  );
}

export default ProfileDropdown;
