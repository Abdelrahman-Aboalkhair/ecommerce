import React from "react";
import { motion } from "framer-motion";

const ProductDetailSkeletonLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Product Details Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images Skeleton */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="aspect-square bg-gray-200 animate-pulse"></div>
          </motion.div>

          {/* Product Info Skeleton */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="space-y-6">
              {/* Product Title */}
              <div className="space-y-2">
                <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Price */}
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Variant Options */}
              <div className="space-y-4">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  {Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="h-10 w-16 bg-gray-200 rounded animate-pulse"
                      ></div>
                    ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Reviews Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="space-y-2 border-b border-gray-100 pb-4"
                >
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(ProductDetailSkeletonLoader);
