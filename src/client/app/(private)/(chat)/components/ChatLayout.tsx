"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatSidebar from "./ChatSidebar";
import ChatMain from "./ChatMain";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";

interface ChatLayoutProps {
  children: React.ReactNode;
  chatId: string;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children, chatId }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  React.useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: isMobile ? -320 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? -320 : 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`${
              isMobile ? "fixed inset-y-0 left-0 z-50 w-80" : "relative w-80"
            } bg-white shadow-lg border-r border-gray-200`}
          >
            <ChatSidebar
              chatId={chatId}
              onClose={() => setSidebarOpen(false)}
              isMobile={isMobile}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatMain
          onMenuClick={toggleSidebar}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
        >
          {children}
        </ChatMain>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatLayout;
