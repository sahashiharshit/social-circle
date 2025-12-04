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
    // First mount → show skeleton
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Whenever route changes → show skeleton again
  useEffect(() => {
    setLoading(true);

    // Small delay so navigation feels smooth
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]); 

  // If layout is loading → show skeleton ONLY
  if (loading) return <SettingsLayoutSkeleton />;
  return (

   
    <div className="flex flex-col h-screen bg-accent">
      {/* Dashboard Navbar */}
      <SettingsNavbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Settings Sidebar */}
        <SettingsSidebar />

        {/* Settings main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
 
  );
}
