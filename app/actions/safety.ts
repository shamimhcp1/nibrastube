"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function selectProfile(profileId: string) {
  const cookieStore = await cookies();
  cookieStore.set("activeProfileId", profileId, {
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
    httpOnly: true,
  });
  redirect(`/kids/${profileId}`);
}

export async function lockToKidsMode() {
  const cookieStore = await cookies();
  cookieStore.set("isKidsMode", "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function unlockParentPortal() {
  const cookieStore = await cookies();
  cookieStore.delete("activeProfileId");
  redirect("/parent/dashboard");
}

export async function unlockKidsMode() {
  const cookieStore = await cookies();
  cookieStore.delete("isKidsMode");
  cookieStore.delete("activeProfileId");
  redirect("/kids");
}
