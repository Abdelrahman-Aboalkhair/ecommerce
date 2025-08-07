"use client";
import { User } from "lucide-react";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import Sidebar from "../../components/layout/Sidebar";
import DashboardSearchBar from "@/app/components/molecules/DashboardSearchbar";
import { useAuth } from "@/app/hooks/useAuth";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <BreadCrumb />
          <div className="flex items-center gap-4 sm:gap-6">
            <DashboardSearchBar />
            <div className="flex items-center gap-2">
              <div className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || "User"}
                    fill
                    sizes="36px"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-500" />
                )}
              </div>
              {user?.name && (
                <span className="text-sm font-medium text-gray-800 hidden sm:inline">
                  {user.name}
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
