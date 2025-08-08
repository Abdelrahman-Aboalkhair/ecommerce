"use client";
import React from "react";
import { motion } from "framer-motion";

const FetchMoreSkeleton: React.FC = () => {
  const skeletonItems = Array(3).fill(0); // Show 3 skeleton cards for "Show More"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {skeletonItems.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="aspect-[3/4] bg-gray-200 animate-pulse"></div>
          <div className="p-4">
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-3 w-1/2 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default React.memo(FetchMoreSkeleton);
