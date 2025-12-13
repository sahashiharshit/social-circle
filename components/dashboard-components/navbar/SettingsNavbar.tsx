"use client"
import Link from "next/link";
import ThemeToggle from "@/components/dashboard-components/navbar/ThemeToggle";
import UserDropdown from "@/components/dashboard-components/navbar/UserDropdown";

import { useSession } from "@/context/SessionContext";

export default  function SettingsNavbar() {
    const session = useSession()

    return (
        <nav className="flex w-full items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          
            <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="font-bold text-xl hidden md:inline">Social Circle</span>
            </Link>
            <div className="flex items-center space-x-2">
                <div>{session?.user.name}</div>
                <ThemeToggle />
                <UserDropdown  />
            </div>
        </nav>

    );
}