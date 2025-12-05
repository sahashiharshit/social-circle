"use client";

import SettingsNavbarSkeleton from "@/components/skeletons/SettingsNavbarSkeleton";
import SettingsSidebarSkeleton from "@/components/skeletons/SettingsSidebarSkeleton";
export default function SettingsLayoutSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-accent animate-pulse">
      {/* Navbar skeleton */}
      <SettingsNavbarSkeleton />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar skeleton */}
        <SettingsSidebarSkeleton />

        {/* Main content skeleton */}
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Fake headers */}
          <div className="h-6 w-48 bg-muted rounded-md" />
          <div className="h-4 w-72 bg-muted rounded-md" />

          {/* Blocks */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 w-full bg-muted rounded-xl"
            />
          ))}
        </main>
      </div>
    </div>
  );
}
