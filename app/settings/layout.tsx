
import SettingsNavbar from "@/components/dashboard-components/navbar/SettingsNavbar";
import SettingsSidebar from "@/components/dashboard-components/sidebar/SettingsSidebar";


export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
