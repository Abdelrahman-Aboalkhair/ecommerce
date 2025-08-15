"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Phone,
  Video,
  Settings,
  X,
  MessageSquare,
  Users,
  BarChart3,
} from "lucide-react";

interface ChatTabsProps {
  isOpen: boolean;
  onClose: () => void;
  chat: any;
  onResolve?: () => void;
  canResolve?: boolean;
}

type TabType = "notes" | "calls" | "settings" | "analytics";

const ChatTabs: React.FC<ChatTabsProps> = ({
  isOpen,
  onClose,
  chat,
  onResolve,
  canResolve = false,
}) => {
  const [activeTab, setActiveTab] = React.useState<TabType>("notes");

  const tabs = [
    { id: "notes" as TabType, label: "Notes", icon: FileText },
    { id: "calls" as TabType, label: "Calls", icon: Phone },
    { id: "settings" as TabType, label: "Settings", icon: Settings },
    { id: "analytics" as TabType, label: "Analytics", icon: BarChart3 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "notes":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Chat Notes</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Add Note
              </button>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Customer Issue</span>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <p className="text-sm text-gray-600">
                  Customer reported issue with order #12345. Payment processed
                  but order not showing in account.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Resolution</span>
                  <span className="text-xs text-gray-500">1 hour ago</span>
                </div>
                <p className="text-sm text-gray-600">
                  Escalated to technical team. Order should appear within 24
                  hours.
                </p>
              </div>
            </div>
          </div>
        );

      case "calls":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Call History</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Start Call
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-green-500" />
                  <div>
                    <div className="text-sm font-medium">Voice Call</div>
                    <div className="text-xs text-gray-500">5 minutes ago</div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">12:34</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Video size={16} className="text-blue-500" />
                  <div>
                    <div className="text-sm font-medium">Video Call</div>
                    <div className="text-xs text-gray-500">1 hour ago</div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">15:22</span>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Chat Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Auto-resolve after inactivity
                </span>
                <button className="w-12 h-6 bg-gray-200 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sound notifications</span>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Typing indicators</span>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                </button>
              </div>
            </div>
            {canResolve && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={onResolve}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Resolve Chat
                </button>
              </div>
            )}
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Chat Analytics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-xs text-blue-700">Messages</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">12:34</div>
                <div className="text-xs text-green-700">Duration</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-xs text-purple-700">Files Shared</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-xs text-orange-700">Calls</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg border-l border-gray-200 z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Additional Features
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close tabs"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">{renderTabContent()}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatTabs;
