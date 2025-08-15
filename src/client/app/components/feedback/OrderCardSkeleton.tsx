import React from "react";

const OrderCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      {/* Header */}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2 sm:mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded"></div>
              <div className="h-3 sm:h-4 bg-gray-300 rounded w-20 sm:w-24"></div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded"></div>
              <div className="h-2 sm:h-3 bg-gray-300 rounded w-24 sm:w-32"></div>
            </div>
          </div>
          <div className="h-5 sm:h-6 bg-gray-300 rounded-full w-16 sm:w-20"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded"></div>
            <div>
              <div className="h-2 sm:h-3 bg-gray-300 rounded w-12 sm:w-16 mb-1"></div>
              <div className="h-3 sm:h-5 bg-gray-300 rounded w-16 sm:w-20"></div>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded"></div>
            <div>
              <div className="h-2 sm:h-3 bg-gray-300 rounded w-8 sm:w-12 mb-1"></div>
              <div className="h-3 sm:h-5 bg-gray-300 rounded w-6 sm:w-8"></div>
            </div>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="mb-3 sm:mb-4">
          <div className="h-2 sm:h-3 bg-gray-300 rounded w-8 sm:w-12 mb-1 sm:mb-2"></div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="h-2 sm:h-3 bg-gray-300 rounded w-24 sm:w-32"></div>
              <div className="h-2 sm:h-3 bg-gray-300 rounded w-12 sm:w-16"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-2 sm:h-3 bg-gray-300 rounded w-20 sm:w-28"></div>
              <div className="h-2 sm:h-3 bg-gray-300 rounded w-10 sm:w-14"></div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="h-8 sm:h-12 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
};

export default OrderCardSkeleton;
