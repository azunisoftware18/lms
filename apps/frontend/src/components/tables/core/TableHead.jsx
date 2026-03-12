// TableHead.jsx - Updated with responsive design
import { useState, useEffect } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import FilterDropdown from "../../ui/FilterDropdown";
import SearchField from "../../ui/SearchField";

// Mobile Filter Drawer Component
const MobileFilterDrawer = ({ isOpen, onClose, filterValue, setFilterValue, filterOptions, search, setSearch }) => {
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
            <h3 className="text-lg font-semibold text-slate-800">Filter & Search</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full active:bg-slate-200">
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="mb-5">
            <label className="text-sm font-medium text-slate-700 mb-2 block">Search</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
          </div>

          {/* Filter */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-700 mb-3 block">Filter by Status</label>
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
                    <span className={`float-right ${filterValue === option.value ? "text-white/80" : "text-slate-400"}`}>
                      {option.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Button */}
          <button
            onClick={() => {
              setSearch("");
              setFilterValue("");
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
  filterOptions = [],
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
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
                <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className={`p-2 border border-slate-200 rounded-lg transition-colors ${
                    filterValue || search 
                      ? 'bg-blue-50 border-blue-200 text-blue-600' 
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Filter size={18} />
                </button>
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
                <Search className="absolute left-3 top-3 text-slate-400" size={16} />
              </div>

              {/* Active Filters */}
              {(search || filterValue) && (
                <div className="flex flex-wrap gap-2">
                  {search && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                      Search: {search.length > 15 ? search.substring(0, 15) + "..." : search}
                      <X size={12} className="cursor-pointer" onClick={() => setSearch("")} />
                    </span>
                  )}
                  {filterValue && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                      Status: {filterValue}
                      <X size={12} className="cursor-pointer" onClick={() => setFilterValue("")} />
                    </span>
                  )}
                </div>
              )}
            </div>
          </th>
        </tr>

        {/* Column Headers - Horizontal Scroll on Mobile */}
        <tr className="border-t border-slate-200 bg-slate-50/50">
          {columns.map((col) => (
            <th
              key={col.accessor}
              className="px-4 py-3 font-semibold text-slate-600 text-[10px] uppercase tracking-wider whitespace-nowrap"
            >
              {col.header}
            </th>
          ))}
          <th className="px-4 py-3 font-semibold text-slate-600 text-[10px] uppercase tracking-wider text-right whitespace-nowrap">
            Actions
          </th>
        </tr>

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          filterOptions={filterOptions}
          search={search}
          setSearch={setSearch}
        />
      </thead>
    );
  }

  // Tablet/Desktop View
  return (
    <thead className="bg-slate-50 border-b border-slate-400">
      {/* Toolbar Row */}
      <tr>
        <th colSpan={columns.length + 1} className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Title */}
            <h2 className="text-sm sm:text-base font-semibold text-slate-700">
              {title}
            </h2>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {/* Search */}
              <div className="w-full sm:w-64 lg:w-72">
                <SearchField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  showResults={false}
                  className="w-full"
                />
              </div>

              {/* Filter */}
              <FilterDropdown
                value={filterValue}
                onChange={setFilterValue}
                options={filterOptions}
                placeholder="Filter by status"
                className="w-full sm:w-40"
              />
            </div>
          </div>
        </th>
      </tr>

      {/* Column Headers */}
      <tr className="border-t border-slate-300">
        {columns.map((col) => (
          <th
            key={col.accessor}
            className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-600 uppercase tracking-wider text-[10px] sm:text-[11px] whitespace-nowrap"
          >
            {col.header}
          </th>
        ))}
        <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-600 uppercase tracking-wider text-[10px] sm:text-[11px] text-right whitespace-nowrap">
          Actions
        </th>
      </tr>
    </thead>
  );
}