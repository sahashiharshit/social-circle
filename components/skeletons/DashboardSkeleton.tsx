"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="border-b">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          {/* Left: logo/title */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>

          {/* Right: nav actions */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 px-4 py-4 md:px-6 md:py-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,320px)]">
          {/* Main content area */}
          <main className="space-y-4 md:space-y-6">
            {/* Create Post skeleton */}
            <section className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex gap-3">
                {/* Avatar */}
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-3">
                  {/* Input */}
                  <Skeleton className="h-10 w-full rounded-full" />

                  {/* Actions row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20 rounded-full" />
                      <Skeleton className="h-8 w-20 rounded-full" />
                      <Skeleton className="h-8 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-9 w-24 rounded-full" />
                  </div>
                </div>
              </div>
            </section>

            {/* Posts list skeleton */}
            <section className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <article
                  key={i}
                  className="rounded-xl border bg-card p-4 shadow-sm space-y-4"
                >
                  {/* Post header */}
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-6" />
                  </div>

                  {/* Post content */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>

                  {/* Optional media */}
                  <Skeleton className="h-40 w-full rounded-lg" />

                  {/* Post actions */}
                  <div className="flex justify-between pt-1">
                    <Skeleton className="h-8 w-16 rounded-full" />
                    <Skeleton className="h-8 w-16 rounded-full" />
                    <Skeleton className="h-8 w-16 rounded-full" />
                  </div>
                </article>
              ))}
            </section>
          </main>

          {/* Right sidebar */}
          <aside className="space-y-4">
            {/* Friend Requests */}
            <section className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Skeleton className="h-7 w-12 rounded" />
                      <Skeleton className="h-7 w-12 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Friends list */}
            <section className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <Skeleton className="h-4 w-28" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Suggestions */}
            <section className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <Skeleton className="h-4 w-28" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-7 w-7 rounded-full" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                    <Skeleton className="h-7 w-14 rounded-full" />
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
