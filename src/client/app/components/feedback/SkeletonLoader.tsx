import React from "react";
import { motion } from "framer-motion";

const SkeletonLoader: React.FC = () => {
  const skeletonItems = Array(10).fill(0); // Adjust number of skeleton items as needed

  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <div className="mb-6 sm:mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
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
    </section>
  );
};

export default React.memo(SkeletonLoader);
