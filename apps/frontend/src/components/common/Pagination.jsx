import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  containerClassName = "",
  showPrevNext = true,
  maxVisiblePages = 5, 
}) {
  if (totalPages <= 1) return null;

  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const generatePageNumbers = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, safeCurrentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    // Always include first page
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    // Middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Always include last page
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  // Helper for button styles to keep code clean
  const baseBtnClass = "flex items-center justify-center min-w-[36px] h-9 px-3 text-sm font-medium transition-all rounded-lg border";
  const activeBtnClass = "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200";
  const inactiveBtnClass = "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95";

  return (
    <nav 
      className={`flex items-center justify-center gap-1.5 py-4 ${containerClassName}`}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      {showPrevNext && (
        <button
          disabled={safeCurrentPage === 1}
          onClick={() => onPageChange(safeCurrentPage - 1)}
          className={`${baseBtnClass} ${inactiveBtnClass} disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed mr-1`}
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
                &hellip;
              </span>
            );
          }

          const isActive = page === safeCurrentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
              className={`${baseBtnClass} ${isActive ? activeBtnClass : inactiveBtnClass}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      {showPrevNext && (
        <button
          disabled={safeCurrentPage === totalPages}
          onClick={() => onPageChange(safeCurrentPage + 1)}
          className={`${baseBtnClass} ${inactiveBtnClass} disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed ml-1`}
        >
          <ChevronRight size={18} />
        </button>
      )}
    </nav>
  );
}