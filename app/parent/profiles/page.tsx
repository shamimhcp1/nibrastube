import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { createProfile, deleteProfile } from "@/app/actions/profiles";
import { inviteParent } from "@/app/actions/invites";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash, Plus, UserCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function ProfilesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const kidProfiles = await db.query.profiles.findMany({
    where: eq(profiles.parentId, session.user.id),
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Kid Profiles</h1>
          <p className="text-muted-foreground mt-2">Manage profiles for your children</p>
        </div>
        <Link href="/parent/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {kidProfiles.map((profile) => (
          <Card key={profile.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                {profile.avatar || "👶"}
              </div>
              <div>
                <CardTitle className="text-xl">{profile.name}</CardTitle>
                <CardDescription>Kid Profile</CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="flex flex-col pt-4 border-t bg-muted/30 space-y-4">
              <div className="flex justify-between w-full">
                <Link href={`/parent/dashboard?profileId=${profile.id}`} className="w-full mr-2">
                  <Button className="w-full" variant="outline">Manage Approved Videos</Button>
                </Link>
                <form action={async () => {
                  "use server";
                  await deleteProfile(profile.id);
                }}>
                  <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                    <Trash size={20} />
                  </Button>
                </form>
              </div>
              
              <div className="w-full pt-4 border-t border-slate-200">
                 <p className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Share Access</p>
                 <form action={async (formData) => {
                    "use server";
                    const email = formData.get("email") as string;
                    if (email) await inviteParent(profile.id, email);
                 }} className="flex gap-2">
                    <Input name="email" placeholder="Spouse's email..." className="h-9 text-xs" type="email" required />
                    <Button size="sm" variant="secondary" className="h-9 px-3">Invite</Button>
                 </form>
              </div>
            </CardFooter>
          </Card>
        ))}

        <Card className="border-2 border-dashed flex flex-col items-center justify-center p-6 bg-muted/5 hover:bg-muted/10 transition-colors">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
              <Plus size={32} className="text-muted-foreground" />
            </div>
            <CardTitle>Add New Profile</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <form action={createProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Kid's Name</Label>
                <Input id="name" name="name" placeholder="Adam" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar (Emoji)</Label>
                <Input id="avatar" name="avatar" placeholder="👦" defaultValue="👦" />
              </div>
              <Button type="submit" className="w-full mt-4">Create Profile</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
