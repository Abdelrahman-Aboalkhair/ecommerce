"use client";
import Table from "@/app/components/layout/Table";
import {
  useClearLogsMutation,
  useDeleteLogMutation,
  useGetAllLogsQuery,
} from "@/app/store/apis/LogsApi";
import React, { useState } from "react";
import LogContext from "./LogContext";
import { withAuth } from "@/app/components/HOC/WithAuth";

const LogsDashboard = () => {
  const { data, isLoading, error } = useGetAllLogsQuery({});
  const [clearLogs, { isLoading: isClearingLogs }] = useClearLogsMutation();
  const [deleteLog, { isLoading: isDeletingLog }] = useDeleteLogMutation();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  if (error) {
    console.log("error: ", error);
  }

  // Format the timestamp to be more readable
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat("default", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
    } catch (error) {
      console.log("error => ", error);
      return timestamp;
    }
  };

  // Shortens IDs for display
  const shortenId = (id) => {
    if (!id) return "";
    return `${id.substring(0, 8)}...`;
  };

  // Handle delete single log
  const handleDeleteLog = (e, logId) => {
    e.stopPropagation(); // Prevent row click
    if (confirm("Are you sure you want to delete this log?")) {
      deleteLog(logId);
    }
  };

  // Handle clear all logs
  const handleClearLogs = async () => {
    await clearLogs(undefined);
    setShowConfirmClear(false);
  };

  const columns = [
    {
      key: "level",
      label: "Level",
      render: (row) => (
        <span
          className={
            row.level === "error"
              ? "text-red-600 bg-red-100 font-medium rounded-full px-2 py-[2px] capitalize"
              : row.level === "warn"
              ? "text-orange-500 bg-orange-100 font-medium rounded-full px-2 py-[2px] capitalize"
              : row.level === "info"
              ? "text-cyan-500 bg-cyan-100 rounded-full px-2 py-[2px] capitalize font-medium"
              : "text-gray-600"
          }
        >
          {row.level}
        </span>
      ),
    },
    {
      key: "message",
      label: "Message",
      className: "max-w-xs truncate",
      render: (row) => (
        <div className="truncate max-w-xs" title={row.message}>
          {row.message}
        </div>
      ),
    },
    {
      key: "context",
      label: "Context",
      render: (row) => (
        <LogContext context={row.context} level={row.level} logId={row.id} />
      ),
    },
    {
      key: "createdAt",
      label: "Timestamp",
      render: (row) => formatTimestamp(row.createdAt),
    },
    {
      key: "id",
      label: "ID",
      className: "text-xs text-gray-500 font-mono",
      render: (row) => shortenId(row.id),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => handleDeleteLog(e, row.id)}
            className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs transition-colors"
            disabled={isDeletingLog}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">System Logs</h1>
        <div className="flex space-x-2">
          {showConfirmClear ? (
            <div className="flex items-center bg-gray-100 p-2 rounded">
              <span className="text-sm text-gray-700 mr-2">Are you sure?</span>
              <button
                onClick={handleClearLogs}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
                disabled={isClearingLogs}
              >
                {isClearingLogs ? "Clearing..." : "Yes, Clear All"}
              </button>
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-3 py-1 ml-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
            >
              Clear All Logs
            </button>
          )}
        </div>
      </div>

      {data && data.logs ? (
        <>
          <div className="mb-2 text-sm text-gray-500">
            {data.logs.length} log entries
          </div>
          <Table
            data={data.logs}
            columns={columns}
            isLoading={isLoading}
            showHeader={false}
            className="cursor-pointer hover:bg-gray-50"
          />
        </>
      ) : isLoading ? (
        <div className="text-center py-8">Loading logs...</div>
      ) : (
        <div className="text-center py-8 text-red-600">Failed to load logs</div>
      )}
    </div>
  );
};

export default withAuth(LogsDashboard);
