
import Navbar from "@/components/dashboard-components/navbar/Navbar";
import UserSessionLoader from "@/components/dashboard-components/UserSessionLoader";
import { SessionProvider } from "@/context/SessionContext";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const user = await UserSessionLoader();
  if (!user) {
    redirect("/");
  }
  return (
    <SessionProvider value={{ user }}>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <header className="h-[60px] "><Navbar /></header>
        <div className="flex flex-1 overflow-hidden p-4 gap-1">
          <main className="flex-1 min-w-0 overflow-y-auto px-2 no-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
