"use client";

import React from "react";
import {
  X,
  User,
  Clock,
  MessageCircle,
  Phone,
  Video,
  FileText,
  Settings,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetMeQuery } from "@/app/store/apis/UserApi";
import { useGetChatQuery } from "@/app/store/apis/ChatApi";

interface ChatSidebarProps {
  chatId: string;
  onClose: () => void;
  isMobile: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatId,
  onClose,
  isMobile,
}) => {
  const { data: userData } = useGetMeQuery(undefined);
  const { data: chatData } = useGetChatQuery(chatId);
  const user = userData?.user;
  const chat = chatData?.chat;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-orange-500";
      case "RESOLVED":
        return "bg-green-500";
      case "CLOSED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ x: isMobile ? -300 : 0 }}
      animate={{ x: 0 }}
      exit={{ x: isMobile ? -300 : 0 }}
      className="h-full flex flex-col bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Support Conversations
        </h2>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* New Conversation Button */}
      <div className="p-4 border-b border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus size={18} />
          New Conversation
        </button>
      </div>

      {/* Current Chat */}
      <div className="p-4 border-b border-gray-200">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              Support Ticket #{chatId.slice(-8)}
            </span>
            <div
              className={`w-2 h-2 rounded-full ${getStatusColor(
                chat?.status || "CLOSED"
              )}`}
            />
          </div>
          <span className="text-xs text-blue-700 capitalize">
            {chat?.status?.toLowerCase() || "unknown"}
          </span>
        </div>
      </div>

      {/* Chat Info */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Customer Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
            Customer
          </h3>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-500" />
              <span className="text-sm font-medium">
                {chat?.customer?.name || "Unknown Customer"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {chat?.customer?.email || "No email provided"}
              </span>
            </div>
          </div>
        </div>

        {/* Chat Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
            Chat Details
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Started</span>
              <span className="font-medium">
                {chat?.createdAt ? formatDate(chat.createdAt) : "Unknown"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last Activity</span>
              <span className="font-medium">
                {chat?.updatedAt ? formatDate(chat.updatedAt) : "Unknown"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Messages</span>
              <span className="font-medium">{chat?.messages?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm">
              <Phone size={16} />
              Call
            </button>
            <button className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
              <Video size={16} />
              Video
            </button>
            <button className="flex items-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm">
              <FileText size={16} />
              Notes
            </button>
            <button className="flex items-center gap-2 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm">
              <Settings size={16} />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Chat ID: {chatId}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatSidebar;
