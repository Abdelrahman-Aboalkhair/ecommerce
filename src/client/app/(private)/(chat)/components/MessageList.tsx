"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageItem from "./MessageItem";
import MessageGroup from "./MessageGroup";

interface MessageListProps {
  messages: any[];
  currentUserId: string;
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isLoading = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date and sender
  const groupedMessages = React.useMemo(() => {
    const groups: any[] = [];
    let currentGroup: any = null;

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString();
      const isCurrentUser = message.sender?.id === currentUserId;
      
      // Check if we should start a new group
      if (!currentGroup || 
          currentGroup.date !== messageDate || 
          currentGroup.isCurrentUser !== isCurrentUser) {
        
        if (currentGroup) {
          groups.push(currentGroup);
        }
        
        currentGroup = {
          date: messageDate,
          isCurrentUser,
          messages: [message]
        };
      } else {
        currentGroup.messages.push(message);
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  }, [messages, currentUserId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-4 space-y-6">
        <AnimatePresence>
          {groupedMessages.map((group, groupIndex) => (
            <motion.div
              key={`${group.date}-${group.isCurrentUser}-${groupIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Date Separator */}
              {groupIndex === 0 || 
               groupedMessages[groupIndex - 1]?.date !== group.date ? (
                <div className="flex justify-center">
                  <div className="bg-white text-gray-500 px-4 py-2 rounded-full text-sm shadow-sm border">
                    {formatDate(group.messages[0].createdAt)}
                  </div>
                </div>
              ) : null}

              {/* Message Group */}
              <MessageGroup
                messages={group.messages}
                isCurrentUser={group.isCurrentUser}
                currentUserId={currentUserId}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
