"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@/assets/icon/icons";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  itemsPerPage,
}: TablePaginationProps) {
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Function to generate page numbers with ellipsis
  const generatePageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Determine the range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust range if current page is near the beginning
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
      }

      // Adjust range if current page is near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }

      // Add left ellipsis if needed
      if (startPage > 2) {
        pages.push("ellipsis-left");
      }

      // Add pages in the middle range
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add right ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-right");
      }

      // Always show last page (if more than 1 page)
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="mt-6 flex items-center justify-between">
      <span className="text-sm text-gray-600">
        Showing {indexOfFirstItem} - {indexOfLastItem} of {totalItems} records
      </span>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to previous page"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>

        {pageNumbers.map((page, index) => {
          if (typeof page === "string" && page.startsWith("ellipsis")) {
            return (
              <span
                key={`${page}-${index}`}
                className="px-2 py-1 text-gray-500 cursor-default"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              className={`rounded-md px-3 py-1 transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-gradient-brand text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => onPageChange(page as number)}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to next page"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
