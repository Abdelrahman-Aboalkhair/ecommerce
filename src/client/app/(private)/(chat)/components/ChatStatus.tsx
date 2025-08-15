"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";

interface ChatStatusProps {
  isTyping?: boolean;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: string;
  connectionStatus?: 'connected' | 'disconnected' | 'reconnecting';
}

const ChatStatus: React.FC<ChatStatusProps> = ({
  isTyping = false,
  status = 'online',
  lastSeen,
  connectionStatus = 'connected'
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'away':
        return 'text-yellow-500';
      case 'offline':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi size={16} className="text-green-500" />;
      case 'disconnected':
        return <WifiOff size={16} className="text-red-500" />;
      case 'reconnecting':
        return <Wifi size={16} className="text-yellow-500 animate-pulse" />;
      default:
        return <Wifi size={16} className="text-gray-500" />;
    }
  };

  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  return (
    <div className="px-4 py-2 bg-white border-t border-gray-200">
      <div className="flex items-center justify-between">
        {/* Status Info */}
        <div className="flex items-center gap-2">
          {isTyping ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <div className="flex items-center gap-1">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                />
              </div>
              <span>Customer is typing...</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
              <span className="capitalize">{status}</span>
              {lastSeen && status === 'offline' && (
                <span className="text-gray-500">
                  • Last seen {formatLastSeen(lastSeen)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {getConnectionIcon()}
          <span className="text-xs text-gray-500 capitalize">
            {connectionStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatStatus;
