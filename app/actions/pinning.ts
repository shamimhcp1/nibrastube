"use server";

import { db } from "@/lib/db";
import { videos, whitelistedVideos } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getVideoDetails } from "@/lib/youtube";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function pinVideo(profileId: string, videoId: string) {
  const session = await getSession();
  if (!session) {
    console.log("Pinning failed: Not authenticated");
    return;
  }
  console.log("Pinning video:", videoId, "for profile:", profileId);

  // 1. Ensure video exists in our 'videos' cache
  const existingVideo = await db.query.videos.findFirst({
    where: eq(videos.id, videoId),
  });

  if (!existingVideo) {
    const details = await getVideoDetails(videoId);
    await db.insert(videos).values({
      id: details.id,
      title: details.title,
      thumbnail: details.thumbnail,
      channelTitle: details.channelTitle,
    });
  }

  // 2. Pin the video to the profile
  await db.insert(whitelistedVideos).values({
    profileId,
    videoId,
  }).onConflictDoNothing();

  // 3. Trigger Real-time sync
  const { pusherServer } = await import("@/lib/pusher");
  await pusherServer.trigger(`profile-${profileId}`, "video-pinned", { videoId });

  revalidatePath(`/parent/dashboard`);
  revalidatePath(`/kids/${profileId}`);
}

export async function unpinVideo(profileId: string, videoId: string) {
  const session = await getSession();
  if (!session) {
    console.log("Unpinning failed: Not authenticated");
    return;
  }
  console.log("Unpinning video:", videoId, "from profile:", profileId);

  await db.delete(whitelistedVideos).where(
    and(
      eq(whitelistedVideos.profileId, profileId),
      eq(whitelistedVideos.videoId, videoId)
    )
  );

  // Trigger Real-time sync
  const { pusherServer } = await import("@/lib/pusher");
  await pusherServer.trigger(`profile-${profileId}`, "video-unpinned", { videoId });

  revalidatePath(`/parent/dashboard`);
  revalidatePath(`/kids/${profileId}`);
}
