"use client";
import React from "react";
import useQueryParams from "@/app/hooks/network/useQueryParams";

interface PaginationComponentProps {
  totalPages: number;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  totalPages,
}) => {
  const { query, updateQuery } = useQueryParams();
  const currentPage = Number(query.page) || 1;

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    updateQuery({ page: newPage });
  };

  return (
    <div className="flex justify-end items-end space-x-4 m-4">
      <button
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 rounded border border-blue-100 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        Previous
      </button>
      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationComponent;
