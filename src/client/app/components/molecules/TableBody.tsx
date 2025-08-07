"use client";

import React from "react";
import { ArrowUpDown, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomLoader from "../feedback/CustomLoader";

const getNestedValue = (obj: any, key: string): any => {
  return key
    .split(".")
    .reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
};

interface Column {
  key: string;
  label: string;
  Ascendantly;
  sortable?: boolean;
  render?: (row: any) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface TableBodyProps {
  data: any[];
  columns: Column[];
  isLoading: boolean;
  emptyMessage: string;
  sortKey: string | null;
  sortDirection: "asc" | "desc";
  onSort: (key: string) => void;
  expandable: boolean;
  expandedRowId: string | null;
  renderExpandedRow?: (row: any) => React.ReactNode;
  selectedRows: Set<string>;
  onSelectRow: (rowId: string) => void;
  onSelectAll: () => void;
}

const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => {
  return (
    <div
      className="flex items-center justify-center cursor-pointer"
      onClick={onChange}
    >
      <div
        className={`w-5 h-5 flex items-center justify-center border rounded-md transition-all ${
          checked ? "bg-primary border-gray-200" : "border-gray-400"
        }`}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-white w-4 h-4 flex items-center justify-center"
          >
            <Check className="w-4 h-4" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

const TableBody: React.FC<TableBodyProps> = ({
  data,
  columns,
  isLoading,
  emptyMessage,
  sortKey,
  sortDirection,
  onSort,
  expandable,
  expandedRowId,
  renderExpandedRow,
  selectedRows,
  onSelectRow,
  onSelectAll,
}) => {
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const expandedRowVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <table className="w-full border-collapse min-w-[600px]">
      <thead>
        <tr className="bg-blue-50">
          <th className="px-4 sm:px-6 py-4 text-left">
            <Checkbox
              checked={selectedRows.size === data.length && data.length > 0}
              onChange={onSelectAll}
            />
          </th>
          {columns.map((column) => (
            <th
              key={column.key}
              className={`px-4 sm:px-6 py-4 text-${
                column.align || "left"
              } text-blue-700 font-medium text-sm ${
                column.width ? `w-${column.width}` : ""
              }`}
            >
              <div className="flex items-center gap-2">
                {column.label}
                {column.sortable && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSort(column.key)}
                    className={`p-1 rounded hover:bg-blue-100 ${
                      sortKey === column.key ? "text-blue-600" : "text-blue-300"
                    }`}
                  >
                    <motion.div
                      animate={{
                        rotate:
                          sortKey === column.key && sortDirection === "desc"
                            ? 180
                            : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowUpDown size={14} />
                    </motion.div>
                  </motion.button>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-blue-50">
        {isLoading ? (
          <tr>
            <td colSpan={columns.length + 1} className="text-center py-16">
              <CustomLoader />
            </td>
          </tr>
        ) : data.length > 0 ? (
          <AnimatePresence>
            {data.map((row, rowIndex) => {
              const isSelected = selectedRows.has(row.id);
              return (
                <React.Fragment key={row.id || rowIndex}>
                  <motion.tr
                    className={`transition-colors text-sm ${
                      isSelected
                        ? "bg-blue-100/50 hover:bg-blue-100/70"
                        : "hover:bg-blue-50/50"
                    }`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={rowIndex}
                    variants={rowVariants}
                    layoutId={`row-${row.id}`}
                    transition={{
                      layout: { duration: 0.3 },
                      backgroundColor: { duration: 0.2 },
                    }}
                  >
                    <td className="px-4 sm:px-6 py-4 relative">
                      {isSelected && (
                        <motion.div
                          className="absolute inset-y-0 left-0 w-1 bg-blue-500"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onSelectRow(row.id)}
                      />
                    </td>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-4 sm:px-6 py-4 text-${
                          column.align || "left"
                        }`}
                      >
                        {column.render
                          ? column.render(row)
                          : getNestedValue(row, column.key) ?? "-"}
                      </td>
                    ))}
                  </motion.tr>
                  {expandable && (
                    <AnimatePresence>
                      {expandedRowId === row.id && renderExpandedRow && (
                        <motion.tr
                          key="expanded-row"
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={expandedRowVariants}
                          className={isSelected ? "bg-blue-50/80" : ""}
                        >
                          <td colSpan={columns.length + 1} className="p-0">
                            <div className="overflow-hidden">
                              {renderExpandedRow(row)}
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  )}
                </React.Fragment>
              );
            })}
          </AnimatePresence>
        ) : (
          <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <td colSpan={columns.length + 1} className="text-center py-16">
              <motion.div
                className="flex flex-col items-center text-blue-300"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <FileText size={32} className="mb-2 opacity-50" />
                <p>{emptyMessage}</p>
              </motion.div>
            </td>
          </motion.tr>
        )}
      </tbody>
      {selectedRows.size > 0 && (
        <tfoot>
          <motion.tr
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-blue-50 border-t-2 border-blue-100"
          >
            <td colSpan={columns.length + 1} className="px-4 sm:px-6 py-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-medium">
                  {selectedRows.size} {selectedRows.size === 1 ? "row" : "rows"}{" "}
                  selected
                </span>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-3 py-1 bg-white border border-blue-200 rounded-md text-blue-600 text-sm hover:bg-blue-50"
                    onClick={onSelectAll}
                  >
                    Clear selection
                  </motion.button>
                </div>
              </div>
            </td>
          </motion.tr>
        </tfoot>
      )}
    </table>
  );
};

export default TableBody;
