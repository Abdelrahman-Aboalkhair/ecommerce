"use client";

import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import useQueryParams from "@/app/hooks/network/useQueryParams";
import TableHeader from "../molecules/TableHeader";
import TableActions from "../molecules/TableActions";
import TableBody from "../molecules/TableBody";
import PaginationComponent from "../organisms/Pagination";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: any) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface TableProps {
  data: any[];
  columns: Column[];
  isLoading?: boolean;
  emptyMessage?: string;
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  showHeader?: boolean;
  showPaginationDetails?: boolean;
  showSearchBar?: boolean;
  totalPages?: number;
  totalResults?: number;
  resultsPerPage?: number;
  currentPage?: number;
  expandable?: boolean;
  expandedRowId?: string | null;
  renderExpandedRow?: (row: any) => React.ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No data available",
  title,
  subtitle,
  onRefresh,
  showHeader = true,
  showSearchBar = true,
  showPaginationDetails = true,
  totalPages,
  totalResults,
  resultsPerPage,
  currentPage,
  expandable = false,
  expandedRowId = null,
  renderExpandedRow,
  className = "",
}) => {
  const { query, updateQuery } = useQueryParams();
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((col) => col.key))
  );

  useEffect(() => {
    if (query.sort) {
      const [field, direction] = (query.sort as string).split(":");
      setSortKey(field || null);
      setSortDirection((direction as "asc" | "desc") || "asc");
    } else {
      setSortKey(null);
      setSortDirection("asc");
    }
  }, [query.sort]);

  const handleSort = (key: string) => {
    const newSortDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(newSortDirection);
    const sortValue = `${key}:${newSortDirection}`;
    updateQuery({ sort: sortValue });
  };

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      updateQuery({ searchQuery: searchQuery || "" });
    }, 300),
    [updateQuery] // Add updateQuery as a dependency
  );

  const handleSearch = (data: { searchQuery: string }) => {
    debouncedSearch(data.searchQuery);
  };

  const handleSelectRow = (rowId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      const allRowIds = data.map((row) => row.id || row._id);
      setSelectedRows(new Set(allRowIds));
    }
  };

  const handleToggleColumn = (columnKey: string) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(columnKey)) {
      if (newVisibleColumns.size > 1) {
        // Prevent hiding all columns
        newVisibleColumns.delete(columnKey);
      }
    } else {
      newVisibleColumns.add(columnKey);
    }
    setVisibleColumns(newVisibleColumns);
  };

  if (!Array.isArray(data)) {
    return (
      <div className="text-center py-12 text-gray-600">{emptyMessage}</div>
    );
  }

  const filteredColumns = columns.filter((col) => visibleColumns.has(col.key));

  return (
    <div
      className={`w-full bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden ${className}`}
    >
      {showHeader && (
        <TableHeader
          title={title}
          subtitle={subtitle}
          totalResults={totalResults}
          currentPage={currentPage}
          resultsPerPage={resultsPerPage}
          onRefresh={onRefresh}
        />
      )}
      <TableActions
        data={data}
        selectedRows={selectedRows}
        columns={filteredColumns}
        showSearchBar={showSearchBar}
        onSearch={handleSearch}
        allColumns={columns}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
      />
      <div className="w-full overflow-x-auto">
        <TableBody
          data={data}
          columns={filteredColumns}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          expandable={expandable}
          expandedRowId={expandedRowId}
          renderExpandedRow={renderExpandedRow}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
        />
      </div>
      {showPaginationDetails && totalPages !== undefined && (
        <div className="p-4 border-t border-blue-100">
          <PaginationComponent totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

export default Table;
