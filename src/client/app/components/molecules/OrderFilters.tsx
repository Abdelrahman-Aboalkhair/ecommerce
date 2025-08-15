import React from "react";
import { Filter, SortAsc, SortDesc } from "lucide-react";

interface OrderFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  statusFilter,
  onStatusFilterChange,
  sortOrder,
  onSortOrderChange,
}) => {
  const statusOptions = [
    { value: "", label: "All Orders" },
    { value: "PENDING", label: "Pending" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "IN_TRANSIT", label: "In Transit" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELED", label: "Canceled" },
    { value: "RETURNED", label: "Returned" },
    { value: "REFUNDED", label: "Refunded" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
      {/* Status Filter */}
      <div className="flex items-center space-x-2">
        <Filter size={14} className="sm:w-4 sm:h-4 text-gray-500" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Order */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() =>
            onSortOrderChange(sortOrder === "desc" ? "asc" : "desc")
          }
          className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200"
        >
          {sortOrder === "desc" ? (
            <SortDesc size={14} className="sm:w-4 sm:h-4 text-gray-500" />
          ) : (
            <SortAsc size={14} className="sm:w-4 sm:h-4 text-gray-500" />
          )}
          <span className="text-gray-700 hidden sm:inline">
            {sortOrder === "desc" ? "Newest First" : "Oldest First"}
          </span>
          <span className="text-gray-700 sm:hidden">
            {sortOrder === "desc" ? "Newest" : "Oldest"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default OrderFilters;
