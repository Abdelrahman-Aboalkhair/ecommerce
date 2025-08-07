"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import useStorage from "@/app/hooks/state/useStorage";
import { useSignOutMutation } from "@/app/store/apis/AuthApi";
import {
  LayoutDashboard,
  ShoppingCart,
  Layers,
  Users,
  LogOut,
  PanelsRightBottom,
  Boxes,
  ChartCandlestick,
  ClipboardPlus,
  ClipboardCheck,
  Section,
  ChartArea,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useStorage<boolean>(
    "sidebarOpen",
    false,
    "local"
  );
  const pathname = usePathname();
  const router = useRouter();
  const [signout] = useSignOutMutation();

  const sections = useMemo(
    () => [
      {
        title: "Overview",
        links: [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ],
      },
      {
        title: "E-commerce",
        links: [
          { name: "Products", href: "/products", icon: Layers },
          { name: "Inventory", href: "/inventory", icon: Section },
          { name: "Attributes", href: "/attributes", icon: Layers },
          { name: "Categories", href: "/categories", icon: Boxes },
          { name: "Transactions", href: "/transactions", icon: ShoppingCart },
          { name: "Users", href: "/users", icon: Users },
          { name: "Chats", href: "/chats", icon: ChartArea },
        ],
      },
      {
        title: "Stats",
        links: [
          { name: "Analytics", href: "/analytics", icon: ChartCandlestick },
          { name: "Reports", href: "/reports", icon: ClipboardPlus },
          { name: "Logs", href: "/logs", icon: ClipboardCheck },
        ],
      },
    ],
    []
  );

  const prependDashboard = (href: string) =>
    href.startsWith("/dashboard") ? href : `/dashboard${href}`;

  const handleSignOut = async () => {
    try {
      await signout().unwrap();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const SidebarLink = ({
    name,
    href,
    Icon,
  }: {
    name: string;
    href: string;
    Icon: React.ElementType;
  }) => {
    const fullHref = prependDashboard(href);
    const isActive = pathname === fullHref;

    return (
      <Link
        href={fullHref}
        prefetch={false}
        className={`relative group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive
            ? "bg-indigo-100 text-indigo-600 font-medium shadow-sm"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <motion.div whileHover={{ scale: 1.1 }}>
          <Icon
            className={`h-5 w-5 transition ${
              isActive ? "text-indigo-600" : "group-hover:text-black"
            }`}
          />
        </motion.div>
        {isOpen && <span className="text-sm">{name}</span>}
      </Link>
    );
  };

  return (
    <motion.aside
      initial={{ width: 80 }}
      animate={{
        width: isOpen ? 260 : 80,
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      className="bg-white border-r border-gray-200 shadow-lg min-h-fit flex flex-col p-4 justify-between md:w-auto w-full md:static fixed top-0 left-0 z-50"
    >
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 flex items-center justify-end rounded-lg transition mb-4 w-full"
        >
          <PanelsRightBottom size={24} className="text-gray-700" />
        </button>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          {sections.map((section, idx) => (
            <div key={section.title} className="mb-2">
              {isOpen && (
                <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400 ml-4 mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.links.map((link) => (
                  <SidebarLink
                    key={link.name}
                    name={link.name}
                    href={link.href}
                    Icon={link.icon}
                  />
                ))}
              </div>
              {idx < sections.length - 1 && (
                <hr className="my-3 border-t border-gray-200" />
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 transition-all duration-300 group"
        >
          <LogOut className="h-5 w-5 text-red-500 group-hover:text-red-600" />
          {isOpen && (
            <span className="text-sm font-medium text-red-600">Sign Out</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
