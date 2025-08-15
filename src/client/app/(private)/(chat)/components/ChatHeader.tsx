"use client";

import React from "react";
import { User, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ChatHeaderProps {
  chat: any;
  onResolve: () => void;
  canResolve: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, onResolve, canResolve }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <AlertCircle size={16} className="text-orange-500" />;
      case 'RESOLVED':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'CLOSED':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-white border-b border-gray-200"
    >
      {/* Customer Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {chat?.customer?.name || 'Unknown Customer'}
          </h3>
          <p className="text-sm text-gray-500">
            {chat?.customer?.email || 'No email provided'}
          </p>
        </div>
      </div>

      {/* Status and Actions */}
      <div className="flex items-center gap-3">
        {/* Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusColor(chat?.status || 'CLOSED')}`}>
          {getStatusIcon(chat?.status || 'CLOSED')}
          <span className="capitalize">{chat?.status?.toLowerCase() || 'unknown'}</span>
        </div>

        {/* Last Activity */}
        <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
          <Clock size={14} />
          <span>{chat?.updatedAt ? formatTime(chat.updatedAt) : 'Unknown'}</span>
        </div>

        {/* Resolve Button */}
        {canResolve && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onResolve}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Resolve
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ChatHeader;
