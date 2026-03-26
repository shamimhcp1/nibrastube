import { db } from "@/lib/db";
import { videos, profiles, whitelistedVideos } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, House } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { KidsFooterGate } from "@/components/kids-footer-gate";
import { getSession } from "@/lib/auth";

interface WatchPageProps {
  params: Promise<{ profileId: string; videoId: string }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { profileId, videoId } = await params;
  const session = await getSession();

  // 1. Verify profile and video approval
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, profileId),
  });

  if (!profile) notFound();

  const isApproved = await db.query.whitelistedVideos.findFirst({
    where: and(
      eq(whitelistedVideos.profileId, profileId),
      eq(whitelistedVideos.videoId, videoId)
    ),
  });

  if (!isApproved) {
    // If not approved, redirect back to the portal
    redirect(`/kids/${profileId}`);
  }

  const video = await db.query.videos.findFirst({
    where: eq(videos.id, videoId),
  });

  if (!video) notFound();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Player Header */}
      <div className="bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
         <Link href={`/kids/${profileId}`}>
            <Button variant="ghost" className="text-white hover:bg-slate-800 gap-2">
               <ArrowLeft size={24} weight="bold" />
               <span className="text-lg font-bold">Back to Videos</span>
            </Button>
         </Link>
         
         <div className="flex-1 text-center px-4">
            <h1 className="text-xl font-bold truncate max-w-2xl mx-auto">{video.title}</h1>
         </div>

         <Link href="/kids">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors">
               <House size={24} weight="bold" />
            </div>
         </Link>
      </div>

      {/* Video Player Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-6xl aspect-video bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border-4 border-slate-800 relative group">
           <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&controls=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
           ></iframe>
        </div>
      </div>

      {/* Kid-Friendly Controls (Optional/Simplified) */}
      <div className="bg-slate-900/50 p-8 flex flex-col items-center gap-4">
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
               <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-lg border-4 border-primary">
                  {profile.avatar}
               </div>
               <div className="text-white">
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Watching as</p>
                  <p className="text-2xl font-black">{profile.name}</p>
               </div>
            </div>
            
            <div className="h-10 w-[2px] bg-slate-800 hidden md:block"></div>

            <p className="text-slate-400 text-lg font-medium hidden md:block">
              Approved by Mom & Dad
            </p>
         </div>
      </div>
    </div>
  );
}
