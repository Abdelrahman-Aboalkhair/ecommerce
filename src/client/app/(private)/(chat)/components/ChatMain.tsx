"use client";

import React from "react";
import { Menu, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import ChatTabs from "./ChatTabs";

interface ChatMainProps {
  children: React.ReactNode;
  onMenuClick: () => void;
  isMobile: boolean;
  sidebarOpen: boolean;
  chat?: any;
  onResolve?: () => void;
  canResolve?: boolean;
}

const ChatMain: React.FC<ChatMainProps> = ({
  children,
  onMenuClick,
  isMobile,
  sidebarOpen,
  chat,
  onResolve,
  canResolve = false,
}) => {
  const [tabsOpen, setTabsOpen] = React.useState(false);

  const toggleTabs = () => {
    setTabsOpen(!tabsOpen);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <motion.div
        initial={false}
        animate={{
          marginLeft: isMobile ? 0 : sidebarOpen ? "320px" : "0px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Customer Support
            </h1>
            <p className="text-sm text-gray-500">Live chat session</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTabs}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle additional features"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">{children}</div>

      {/* Toggleable Tabs */}
      <ChatTabs
        isOpen={tabsOpen}
        onClose={() => setTabsOpen(false)}
        chat={chat}
        onResolve={onResolve}
        canResolve={canResolve}
      />
    </div>
  );
};

export default ChatMain;
