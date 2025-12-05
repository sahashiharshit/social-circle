"use client";
import SettingsNavbar from "@/components/dashboard-components/navbar/SettingsNavbar";
import SettingsSidebar from "@/components/dashboard-components/sidebar/SettingsSidebar";
import SettingsLayoutSkeleton from "@/components/skeletons/SettingsSkeleton";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    setLoading(true);


    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);


  if (loading) return <SettingsLayoutSkeleton />;
  return (


    <div className="flex flex-col h-screen bg-accent">

      <SettingsNavbar />

      <div className="flex flex-1 overflow-hidden">

        <SettingsSidebar />


        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>

  );
}
