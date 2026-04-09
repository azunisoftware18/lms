// TableHead.jsx - Updated with responsive design
import { useState, useEffect } from "react";
import { Search, Filter, X, RefreshCw } from "lucide-react";
import FilterDropdown from "../../ui/FilterDropdown";
import SearchField from "../../ui/SearchField";
import DateFilter from "../../common/DateFilter";

// Mobile Filter Drawer Component
const MobileFilterDrawer = ({
  isOpen,
  onClose,
  filterValue,
  setFilterValue,
  filterOptions,
  search,
  setSearch,
  dateValue,
  setDateValue,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 animate-slide-up">
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-slate-800">
              Filter & Search
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full active:bg-slate-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="mb-5">
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <Search
                className="absolute left-3 top-3.5 text-slate-400"
                size={18}
              />
            </div>
          </div>

          {/* Filter */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-700 mb-3 block">
              Filter by Status
            </label>
            <div className="space-y-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilterValue(option.value);
                    onClose();
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                    filterValue === option.value
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  {option.count !== undefined && (
                    <span
                      className={`float-right ${filterValue === option.value ? "text-white/80" : "text-slate-400"}`}
                    >
                      {option.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-700 mb-3 block">
              Filter by Date
            </label>
            <DateFilter
              value={dateValue}
              onChange={(v) => setDateValue && setDateValue(v)}
            />
          </div>

          {/* Clear Button */}
          <button
            onClick={() => {
              setSearch("");
              setFilterValue("");
              setDateValue && setDateValue("");
              onClose();
            }}
            className="w-full py-3 text-sm text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors active:bg-red-100"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default function TableHead({
  columns = [],
  title = "",
  search,
  setSearch,
  filterValue,
  setFilterValue,
  dateValue,
  setDateValue,
  filterOptions = [],
  wrapHeaders = false,
  onRefresh,
  refreshing = false,
  headerAction,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Mobile View
  if (isMobile) {
    return (
      <thead className="bg-white border-b border-slate-200">
        {/* Mobile Toolbar */}
        <tr>
          <th colSpan={columns.length + 1} className="px-4 py-3">
            <div className="space-y-3">
              {/* Title and Filter Button */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700 min-w-0">
                  {title}
                </h2>
                <div className="flex items-center gap-2">
                  {headerAction}
                  {onRefresh && (
                    <button
                      onClick={onRefresh}
                      disabled={refreshing}
                      className="p-2 border border-slate-200 rounded-lg transition-colors bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                      aria-label="Refresh table"
                    >
                      <RefreshCw
                        size={18}
                        className={refreshing ? "animate-spin" : ""}
                      />
                    </button>
                  )}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className={`p-2 border border-slate-200 rounded-lg transition-colors ${
                      filterValue || search
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Filter size={18} />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search
                  className="absolute left-3 top-3 text-slate-400"
                  size={16}
                />
              </div>

              {/* Active Filters */}
              {(search || filterValue) && (
                <div className="flex flex-wrap gap-2">
                  {search && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                      Search:{" "}
                      {search.length > 15
                        ? search.substring(0, 15) + "..."
                        : search}
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => setSearch("")}
                      />
                    </span>
                  )}
                  {filterValue && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                      Status: {filterValue}
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => setFilterValue("")}
                      />
                    </span>
                  )}
                </div>
              )}
            </div>
          </th>
        </tr>

        {/* Column headers hidden on mobile to avoid duplicate/header clutter */}

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          filterOptions={filterOptions}
          search={search}
          setSearch={setSearch}
          dateValue={dateValue}
          setDateValue={setDateValue}
        />
      </thead>
    );
  }

  // Tablet/Desktop View
  return (
    <thead className="bg-white border-b border-slate-200">
      {/* Toolbar Row */}
      <tr>
        <th colSpan={columns.length + 1} className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 min-w-0">
            {/* Title */}
            <h2 className="text-sm sm:text-base font-semibold text-slate-700 min-w-0">
              {title}
            </h2>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 min-w-0 lg:ml-4 lg:justify-end">
              {/* Search */}
              <div className="w-full sm:flex-1 lg:flex-none lg:w-72 min-w-0">
                <SearchField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  showResults={false}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 sm:flex-nowrap sm:shrink-0">
                {/* Filter */}
                <div className="w-full sm:w-44 sm:shrink-0">
                  <FilterDropdown
                    value={filterValue}
                    onChange={setFilterValue}
                    options={filterOptions}
                    placeholder="Filter by status"
                    className="w-full"
                  />
                </div>

                {/* Date Filter (optional) */}
                <div className="w-full sm:w-44 sm:shrink-0">
                  <DateFilter
                    value={dateValue}
                    onChange={(v) => setDateValue && setDateValue(v)}
                  />
                </div>

                {onRefresh && (
                  <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed sm:shrink-0"
                    aria-label="Refresh table"
                  >
                    <RefreshCw
                      size={16}
                      className={refreshing ? "animate-spin" : ""}
                    />
                    <span className="hidden xl:inline">Refresh</span>
                  </button>
                )}

                {headerAction && (
                  <div className="w-full sm:w-auto sm:shrink-0">
                    {headerAction}
                  </div>
                )}
              </div>
            </div>
          </div>
        </th>
      </tr>

      {/* Column Headers */}
      <tr className="bg-slate-50 border-t border-slate-200">
        {columns.map((col) => (
          <th
            key={col.accessor}
            className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-500 uppercase tracking-wider text-[10px] sm:text-[11px] ${wrapHeaders ? "whitespace-normal wrap-break-word" : "whitespace-nowrap"} ${col.headerClassName || ""}`}
          >
            {col.header}
          </th>
        ))}
        <th
          className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-500 uppercase tracking-wider text-[10px] sm:text-[11px] text-right ${wrapHeaders ? "whitespace-normal wrap-break-word" : "whitespace-nowrap"}`}
        >
          Actions
        </th>
      </tr>
    </thead>
  );
}
