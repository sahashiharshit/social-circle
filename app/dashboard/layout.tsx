
import Navbar from "@/components/dashboard-components/navbar/Navbar";
import DashboardSidebar from "@/components/dashboard-components/sidebar/DashboardSidebar";
import { SessionProvider } from "@/context/SessionContext";
import { auth } from "@/lib/auth";
import { getFriends, getFriendSuggestions, getIncomingFriendRequests } from "@/lib/database-operations/friends";
import { FullSession, User } from "@/types/Session";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";





export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
 
  const session: FullSession = await auth.api.getSession({
    headers: await headers()
  });
  if (!session) redirect('/');
  const user: User | null = {
    id: session.user.id,
    name: session.user.name,
    image: session.user.image ?? null
  }
  const [friends,suggestions,requests] = await Promise.all([
    getFriends(user.id),
    getFriendSuggestions(user.id),
    getIncomingFriendRequests(user.id),
  ]);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
    <SessionProvider value={{ user }}>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        {/* Navbar */}
        <header className="h-[60px] "><Navbar /></header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden p-4 gap-1">

          <main className="flex-1 min-w-0 overflow-y-auto px-2 no-scrollbar">
            {children}
          </main>

          <aside className="w-[250px] bg-accent/40 rounded-lg overflow-y-auto">
            <DashboardSidebar friends={friends} suggestions={suggestions} requests={requests}/>
          </aside>
        </div>
      </div>
    </SessionProvider>
    </Suspense>
  );
}
