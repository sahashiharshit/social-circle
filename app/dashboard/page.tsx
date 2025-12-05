import MainContent from "@/components/dashboard-components/main/MainComponent";
import DashboardSidebar from "@/components/dashboard-components/sidebar/DashboardSidebar";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { auth } from "@/lib/auth";
import { getFriends, getFriendSuggestions, getIncomingFriendRequests } from "@/lib/database-operations/friends";
import { FullSession, User } from "@/types/Session";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function DashboardPage() {
    const session: FullSession = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) redirect('/');
    const user: User | null = {
        id: session.user.id,
        name: session.user.name,
        image: session.user.image ?? null
    }
    const [friends, suggestions, requests] = await Promise.all([
        getFriends(user.id),
        getFriendSuggestions(user.id),
        getIncomingFriendRequests(user.id),
    ]);
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <div className="flex gap-1 h-full">
                <MainContent />
                <aside className="w-[250px] bg-accent/40 rounded-lg overflow-y-auto">
                    <DashboardSidebar friends={friends} suggestions={suggestions} requests={requests} />
                </aside>
            </div>
        </Suspense>

    );
}