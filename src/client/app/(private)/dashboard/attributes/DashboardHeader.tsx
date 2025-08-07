"use client";

import React from "react";
import { Database } from "lucide-react";

const DashboardHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <Database size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Attributes Dashboard
          </h1>
        </div>
      </div>
      <p className="mt-2 text-gray-600 max-w-2xl">
        Create and manage product attributes, assign them to categories or
        products, and customize your product catalog structure.
      </p>
    </div>
  );
};

export default DashboardHeader;
