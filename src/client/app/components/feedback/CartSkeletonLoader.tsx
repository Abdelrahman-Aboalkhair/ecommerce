import React from "react";
import { motion } from "framer-motion";

const CartSkeletonLoader: React.FC = () => {
  const skeletonItems = Array(3).fill(0); // Show 3 skeleton cart items

  return (
    <div className="space-y-4">
      {skeletonItems.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          {/* Product Image Skeleton */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded animate-pulse"></div>

          {/* Product Details Skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Quantity Selector Skeleton */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Price and Remove Button Skeleton */}
          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 w-full sm:w-auto">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default React.memo(CartSkeletonLoader);
