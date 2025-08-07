"use client";

import React from "react";
import { Download } from "lucide-react";
import DropdownMultiSelect from "./DropdownMultiSelect";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface TableActionsProps {
  data: any[];
  selectedRows: Set<string>;
  columns: Column[];
  showSearchBar: boolean;
  onSearch: (data: { searchQuery: string }) => void;
  allColumns: Column[];
  visibleColumns: Set<string>;
  onToggleColumn: (columnKey: string) => void;
}

const TableActions: React.FC<TableActionsProps> = ({
  data,
  selectedRows,
  columns,
  showSearchBar,
  onSearch,
  allColumns,
  visibleColumns,
  onToggleColumn,
}) => {
  const handleExport = () => {
    const rowsToExport =
      selectedRows.size > 0
        ? data.filter((row) => selectedRows.has(row.id || row._id))
        : data;

    const csvContent = [
      columns.map((col) => `"${col.label}"`).join(","),
      ...rowsToExport.map((row) =>
        columns
          .map((col) => {
            const value = col.render ? col.render(row) : row[col.key];
            return `"${value?.toString().replace(/"/g, '""') || ""}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `table_export_${new Date().toISOString()}.csv`;
    link.click();
  };

  return (
    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        {showSearchBar && (
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearch({ searchQuery: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
          />
        )}
        <DropdownMultiSelect
          label="Select Columns"
          options={allColumns.map((col) => ({
            label: col.label,
            value: col.key,
          }))}
          selectedValues={Array.from(visibleColumns)}
          onChange={onToggleColumn}
        />
      </div>
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 w-full sm:w-auto"
      >
        <Download size={16} />
        Export {selectedRows.size > 0 ? "Selected" : "All"}
      </button>
    </div>
  );
};

export default TableActions;
