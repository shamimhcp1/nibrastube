import { acceptInvite } from "@/app/actions/invites";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { invites, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const session = await getSession();

  const invite = await db.query.invites.findFirst({
    where: eq(invites.token, token),
  });

  if (!invite) notFound();
  
  const fromParent = await db.query.users.findFirst({
    where: eq(users.id, invite.fromParentId),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-lg shadow-2xl border-2 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-4xl">
             🤝
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">You're Invited!</CardTitle>
          <CardDescription className="text-lg font-medium">
             {fromParent?.name || "A parent"} has invited you to manage a kid profile on NibrasTube.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-8 border-b italic text-slate-500">
           "Join me in curating a safe video experience for our children."
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-8">
           {session ? (
              <form action={async () => {
                "use server";
                await acceptInvite(token);
                return;
              }} className="w-full">
                <Button size="lg" className="w-full h-16 text-xl font-bold rounded-2xl shadow-xl">
                   Accept Invitation
                </Button>
              </form>
           ) : (
              <Link href={`/login?callback=/invite/${token}`} className="w-full">
                <Button size="lg" className="w-full h-16 text-xl font-bold rounded-2xl shadow-xl">
                   Log in to Accept
                </Button>
              </Link>
           )}
           <p className="text-sm text-center text-muted-foreground">
              By accepting, you will be able to search and approved videos for this profile.
           </p>
        </CardFooter>
      </Card>
    </div>
  );
}

import Link from "next/link";
