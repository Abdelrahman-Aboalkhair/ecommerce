"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetLogByIdQuery } from "@/app/store/apis/LogsApi";
import { withAuth } from "@/app/components/HOC/WithAuth";

const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("default", {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(date);
  } catch {
    return timestamp;
  }
};

const shortenId = (id: string): string =>
  id ? `${id.substring(0, 8)}...` : "";

interface LogDetailsProps {
  params: { logId: string };
}

const LogDetails: React.FC<LogDetailsProps> = ({ params }) => {
  const { logId } = React.use(params);
  const router = useRouter();
  const { data, isLoading, error } = useGetLogByIdQuery(logId);

  if (isLoading) {
    return (
      <div className="p-4 text-center py-8">
        <span className="text-gray-600">Loading log details...</span>
      </div>
    );
  }

  if (error || !data?.log) {
    return (
      <div className="p-4 text-center py-8">
        <span className="text-red-600">
          {error ? "Failed to load log details" : "Log not found"}
        </span>
      </div>
    );
  }

  const { id, level, message, context, createdAt } = data.log;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Log Details</h1>
        <button
          onClick={() => router.push("/dashboard/logs")}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
        >
          Back to Logs
        </button>
      </div>

      {/* Log Overview */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Level</div>
            <span
              className={
                level === "error"
                  ? "text-red-600 bg-red-100 font-medium rounded-full px-2 py-[2px] capitalize inline-block"
                  : level === "warn"
                  ? "text-orange-500 bg-orange-100 font-medium rounded-full px-2 py-[2px] capitalize inline-block"
                  : level === "info"
                  ? "text-cyan-500 bg-cyan-100 rounded-full px-2 py-[2px] capitalize font-medium inline-block"
                  : "text-gray-600"
              }
            >
              {level || "unknown"}
            </span>
          </div>
          <div>
            <div className="text-sm text-gray-500">Timestamp</div>
            <div className="text-gray-800">{formatTimestamp(createdAt)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Message</div>
            <div className="text-gray-800">{message}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Log ID</div>
            <div className="text-gray-800 font-mono text-sm">{id}</div>
          </div>
        </div>
      </div>

      {/* Context Details */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Context</h2>
        {context && Object.keys(context).length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(context).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <div className="text-sm text-gray-500 capitalize">{key}</div>
                <div className="text-gray-800 break-all">
                  {typeof value === "string" &&
                  value.match(
                    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
                  )
                    ? shortenId(value)
                    : value?.toString() || "N/A"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 italic">No context available</div>
        )}
      </div>
    </div>
  );
};

export default withAuth(LogDetails);
