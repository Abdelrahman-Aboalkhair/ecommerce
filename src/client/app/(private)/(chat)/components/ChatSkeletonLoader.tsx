"use client";

import React from "react";
import { motion } from "framer-motion";

const ChatSkeletonLoader: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Skeleton */}
      <div className="w-80 bg-white shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-6">
          {/* Status */}
          <div className="space-y-3">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-3">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header Skeleton */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Messages Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-3 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                {index % 2 === 0 && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                )}
                <div className={`flex flex-col ${index % 2 === 0 ? 'items-start' : 'items-end'}`}>
                  <div className={`px-4 py-2 rounded-2xl max-w-xs ${
                    index % 2 === 0 
                      ? 'bg-white rounded-bl-md' 
                      : 'bg-blue-500 rounded-br-md'
                  }`}>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}>
                    <div className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                {index % 2 === 1 && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Input Skeleton */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-end gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex-1 relative">
              <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="absolute right-2 bottom-2 w-8 h-8 bg-gray-300 rounded-lg animate-pulse" />
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSkeletonLoader;
