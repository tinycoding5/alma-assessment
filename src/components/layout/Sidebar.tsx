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
        <div className="flex items-center space-x-2 p-4 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
            A
          </div>
          <div className="text-sm font-medium text-black">Admin</div>
        </div>
        <div
          className="flex items-center space-x-2 p-4 cursor-pointer"
          onClick={handleLogout}
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-black"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"
            />
          </svg>
          <div className="text-sm font-medium text-black">Log Out</div>
        </div>
      </div>
    </div>
  );
}
