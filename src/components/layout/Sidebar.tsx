"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login"); // Redirect to login after logout
  };

  return (
    <div className="fixed inset-y-0 left-0 bg-white w-48 p-4 shadow-sm">
      <div className="mb-10">
        <Link href="/dashboard" className="text-2xl font-bold text-black">
          alma
        </Link>
      </div>
      <nav className="space-y-2">
        <Link
          href="/dashboard/leads"
          className={`block text-black px-4 py-2 rounded-md ${
            isActive("/dashboard/leads")
              ? "bg-gray-100 font-medium"
              : "hover:bg-gray-50"
          }`}
        >
          Leads
        </Link>
        <Link
          href="/dashboard/settings"
          className={`block px-4 py-2 text-black rounded-md ${
            isActive("/dashboard/settings")
              ? "bg-gray-100 font-medium"
              : "hover:bg-gray-50"
          }`}
        >
          Settings
        </Link>
      </nav>
      <div className="absolute bottom-4 left-0 w-full px-4">
        <div
          className="flex items-center space-x-2 p-4 cursor-pointer"
          onClick={handleLogout}
        >
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
            A
          </div>
          <div className="text-sm font-medium text-black">Admin</div>
        </div>
      </div>
    </div>
  );
}
