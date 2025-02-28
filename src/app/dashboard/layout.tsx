import Sidebar from "@/components/layout/Sidebar";
import { requireAuth } from "@/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication on the server
  requireAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 ml-48 overflow-y-auto">{children}</main>
    </div>
  );
}
