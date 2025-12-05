import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Items info */}
        <div className="text-sm text-gray-600">
          Zeige <span className="font-semibold text-gray-900">{startItem}</span> bis{' '}
          <span className="font-semibold text-gray-900">{endItem}</span> von{' '}
          <span className="font-semibold text-gray-900">{totalItems}</span> Einträgen
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border transition-colors ${
              currentPage === 1
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-yellow-400'
            }`}
            aria-label="Vorherige Seite"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Page numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-gray-400"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`min-w-[40px] px-3 py-2 rounded-lg font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-yellow-400 text-gray-900 shadow-sm'
                      : 'text-gray-700 hover:bg-yellow-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Mobile page indicator */}
          <div className="sm:hidden">
            <span className="text-sm font-semibold text-gray-900">
              {currentPage} / {totalPages}
            </span>
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg border transition-colors ${
              currentPage === totalPages
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-yellow-400'
            }`}
            aria-label="Nächste Seite"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
