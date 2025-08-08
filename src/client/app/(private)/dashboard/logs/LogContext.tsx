"use client";

import React from "react";
import { useRouter } from "next/navigation";

const LogContext = ({ context, level, logId }) => {
  const router = useRouter();

  if (!context) {
    return <span className="text-gray-400 italic">No context</span>;
  }

  const handleViewDetails = () => {
    router.push(`/dashboard/logs/${logId}`);
  };

  // For info logs - show minimal information
  if (level === "info") {
    return (
      <div className="flex flex-col">
        {context.userId && (
          <div className="text-sm">
            <span className="font-medium text-gray-600">User:</span>{" "}
            <span className="font-mono text-xs">
              {context.userId.substring(0, 8)}...
            </span>
          </div>
        )}
        {Object.keys(context).length > (context.userId ? 1 : 0) && (
          <button
            onClick={handleViewDetails}
            className="text-blue-600 hover:text-blue-800 text-xs mt-2"
          >
            View all details
          </button>
        )}
      </div>
    );
  }

  // For error logs - show minimal critical info
  if (level === "error") {
    return (
      <div className="flex flex-col">
        {context.statusCode && (
          <div className="text-sm">
            <span className="font-medium text-gray-600">Status:</span>{" "}
            <span
              className={
                context.statusCode >= 500 ? "text-red-600" : "text-orange-500"
              }
            >
              {context.statusCode}
            </span>
          </div>
        )}
        {context.method && context.url && (
          <div className="text-sm truncate max-w-xs">
            <span className="font-medium text-gray-600">Endpoint:</span>{" "}
            <span className="font-mono text-xs">
              {context.method} {context.url.split("?")[0]}
            </span>
          </div>
        )}
        <button
          onClick={handleViewDetails}
          className="text-blue-600 hover:text-blue-800 text-xs mt-2"
        >
          View full error details
        </button>
      </div>
    );
  }

  // Default case for any other log level
  return (
    <div className="flex flex-col">
      <div className="text-sm text-gray-500">
        {Object.keys(context).length} field
        {Object.keys(context).length !== 1 ? "s" : ""}
      </div>
      <button
        onClick={handleViewDetails}
        className="text-blue-600 hover:text-blue-800 text-xs mt-2"
      >
        View details
      </button>
    </div>
  );
};

export default LogContext;
