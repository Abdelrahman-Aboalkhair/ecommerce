"use client";

import React from "react";
import { useGetUserOrdersQuery } from "@/app/store/apis/OrderApi";
import MainLayout from "@/app/components/templates/MainLayout";
import { motion } from "framer-motion";
import {
  Package,
  Calendar,
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { withAuth } from "@/app/components/HOC/WithAuth";
import OrderCardSkeleton from "@/app/components/feedback/OrderCardSkeleton";
import OrderFilters from "@/app/components/molecules/OrderFilters";

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      PROCESSING: { color: "bg-blue-100 text-blue-800", icon: Clock },
      SHIPPED: { color: "bg-purple-100 text-purple-800", icon: Truck },
      IN_TRANSIT: { color: "bg-indigo-100 text-indigo-800", icon: Truck },
      DELIVERED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      CANCELED: { color: "bg-red-100 text-red-800", icon: XCircle },
      RETURNED: { color: "bg-orange-100 text-orange-800", icon: XCircle },
      REFUNDED: { color: "bg-gray-100 text-gray-800", icon: XCircle },
    };
    return configs[status as keyof typeof configs] || configs.PENDING;
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <div
      className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${config.color}`}
    >
      <IconComponent size={12} className="sm:w-3 sm:h-3 mr-1" />
      <span className="hidden sm:inline">{status.replace("_", " ")}</span>
      <span className="sm:hidden">
        {status.replace("_", " ").split(" ")[0]}
      </span>
    </div>
  );
};

// Order card component
const OrderCard = ({ order }: { order: any }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getItemCount = (orderItems: any[]) => {
    return (
      orderItems?.reduce(
        (total: number, item: any) => total + item.quantity,
        0
      ) || 0
    );
  };

  const truncateId = (id: string) => {
    return id.length > 8 ? `${id.substring(0, 8)}...` : id;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Header */}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2 sm:mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
              <Package
                size={14}
                className="sm:w-4 sm:h-4 text-gray-500 flex-shrink-0"
              />
              <span className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                Order #{truncateId(order.id)}
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Calendar
                size={12}
                className="sm:w-3 sm:h-3 text-gray-400 flex-shrink-0"
              />
              <span className="text-xs sm:text-sm text-gray-500 truncate">
                {formatDate(order.orderDate)}
              </span>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <DollarSign
              size={14}
              className="sm:w-4 sm:h-4 text-green-500 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                {formatCurrency(order.amount)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <ShoppingBag
              size={14}
              className="sm:w-4 sm:h-4 text-blue-500 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Items</p>
              <p className="text-sm sm:text-lg font-semibold text-gray-900">
                {getItemCount(order.orderItems)}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items Preview */}
        {order.orderItems && order.orderItems.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <p className="text-xs text-gray-500 mb-1 sm:mb-2">Items:</p>
            <div className="space-y-1">
              {order.orderItems.slice(0, 2).map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs sm:text-sm"
                >
                  <span className="text-gray-700 truncate flex-1 mr-2">
                    {item.variant?.product?.name || "Product"}
                    {item.quantity > 1 && ` (×${item.quantity})`}
                  </span>
                  <span className="text-gray-500 font-medium text-xs sm:text-sm flex-shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              {order.orderItems.length > 2 && (
                <p className="text-xs text-gray-400">
                  +{order.orderItems.length - 2} more items
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          href={`/orders/${order.id}`}
          className="w-full flex items-center justify-center space-x-1 sm:space-x-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-200 group text-sm sm:text-base"
        >
          <span>Track Order</span>
          <ArrowRight
            size={14}
            className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </div>
    </motion.div>
  );
};

const UserOrders = () => {
  const { data, isLoading, error } = useGetUserOrdersQuery({});
  const orders = data?.orders || [];

  // Filter and sort state
  const [statusFilter, setStatusFilter] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  // Filter and sort orders
  const filteredAndSortedOrders = React.useMemo(() => {
    let filtered = orders;

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((order: any) => order.status === statusFilter);
    }

    // Apply sort order
    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [orders, statusFilter, sortOrder]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-8"
        >
          <Package size={20} className="sm:w-6 sm:h-6 text-indigo-500" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Your Orders
          </h1>
        </motion.div>

        {/* Filters */}
        {!isLoading && orders.length > 0 && (
          <OrderFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        )}

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(6)].map((_, index) => (
              <OrderCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-500">
              Error loading orders: {"Unknown error"}
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">You have no orders yet</p>
            <Link
              href="/products"
              className="mt-4 inline-block text-indigo-500 hover:text-indigo-600 font-medium transition-colors duration-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : filteredAndSortedOrders.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Package
              size={40}
              className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3 sm:mb-4"
            />
            <p className="text-base sm:text-lg text-gray-600">
              No orders match your filters
            </p>
            <button
              onClick={() => setStatusFilter("")}
              className="mt-3 sm:mt-4 inline-block text-indigo-500 hover:text-indigo-600 font-medium transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {filteredAndSortedOrders.map((order: any) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default withAuth(UserOrders);
