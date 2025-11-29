
import Navbar from "@/components/dashboard-components/navbar/Navbar";
import DashboardSidebar from "@/components/dashboard-components/sidebar/DashboardSidebar";
import { SessionProvider } from "@/context/SessionContext";
import { auth } from "@/lib/auth";
import { getFriends, getFriendSuggestions } from "@/lib/database-operations/friends";
import { FullSession, User } from "@/types/Session";
import { headers } from "next/headers";
import { redirect } from "next/navigation";



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
  const friends = await getFriends(user.id);
  const suggestions = await getFriendSuggestions(user.id);
  return (
    <SessionProvider value={{ user }}>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        {/* Navbar */}
        <header className="h-[60px] "><Navbar /></header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden p-4 gap-1">
          {/* Sidebar */}
          <aside className="w-[250px] bg-accent/40 rounded-lg overflow-y-auto">
            Sidebar Content will appear here
          </aside>

          <main className="flex-1 min-w-0 overflow-y-auto px-2 no-scrollbar">
            {children}
          </main>

          <aside className="w-[250px] bg-accent/40 rounded-lg overflow-y-auto">
            <DashboardSidebar friends={friends} suggestions={suggestions}/>
          </aside>
        </div>
      </div>
    </SessionProvider>
  );
}
