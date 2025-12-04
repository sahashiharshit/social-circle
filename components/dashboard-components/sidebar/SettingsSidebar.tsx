"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";


const links = [
  
  { name: "Profile", href: "/settings/profile" },
  { name: "Account", href: "/settings/account" },
  
]

export default function SettingsSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 border-r p-4 bg-accent/40">
      <nav className="space-y-2">
        {links.map(link => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md hover:bg-accent/60 ${active ? "bg-accent font-semibold" : ""
                }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>

  );
}