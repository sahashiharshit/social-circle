"use client";
import { logout } from "@/app/actions/auth-actions";
import Link from "next/link";
import { useState } from "react";
export default function UserDropdown({ user }: { user: any }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)} className=" p-2 rounded-lg hover:bg-accent transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" d="M12 6h.01M12 12h.01M12 18h.01" />
                </svg>
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-background border rounded-lg shadow-lg py-1">

                    <Link
                        href="/dashboard/profile"
                        className="block px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setOpen(false)}
                    >
                        Profile
                    </Link>

                    <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setOpen(false)}
                    >
                        Settings
                    </Link>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
                        >
                            Logout
                        </button>
                    </form>

                </div>
            )}
        </div>
    );
}
