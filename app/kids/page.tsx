import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default async function KidsProfileSelectPage() {
  // We can show all profiles or require a parent login first to see them
  // For now, let's assume we show profiles from the session or just all profiles if it's a dedicated kid device
  const session = await getSession();
  
  const allProfiles = session 
    ? await db.query.profiles.findMany({ where: eq(profiles.parentId, session.user.id) })
    : await db.query.profiles.findMany(); // fallback or different logic for kids' device

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-12 text-center tracking-tight">
        Who's watching?
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl w-full">
        {allProfiles.map((profile) => (
          <Link key={profile.id} href={`/kids/${profile.id}`} className="group">
            <Card className="aspect-square border-0 shadow-none bg-transparent hover:scale-105 transition-transform duration-300">
              <CardContent className="p-0 flex flex-col items-center">
                <div className="w-full aspect-square bg-white rounded-3xl shadow-xl border-4 border-transparent group-hover:border-primary flex items-center justify-center text-7xl md:text-8xl transition-colors">
                  {profile.avatar || "👶"}
                </div>
                <h2 className="mt-6 text-2xl md:text-3xl font-bold text-slate-700 group-hover:text-primary transition-colors">
                  {profile.name}
                </h2>
              </CardContent>
            </Card>
          </Link>
        ))}

        {allProfiles.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-muted-foreground">No profiles found. Go to the parent portal to create one!</p>
            <Link href="/parent/profiles" className="mt-4 inline-block text-primary font-bold hover:underline">
              Parent Portal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
