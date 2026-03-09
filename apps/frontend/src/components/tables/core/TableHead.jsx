import FilterDropdown from "../../ui/FilterDropdown";
import SearchField from "../../ui/SearchField";

export default function TableHead({
  columns = [],
  title = "",
  search,
  setSearch,
  filterValue,
  setFilterValue,
  filterOptions = [],
}) {
  return (
    <thead className="bg-slate-50 border-b border-slate-200">

      {/* Toolbar Row */}
      <tr>
        <th colSpan={columns.length + 1} className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">

            {/* Title Left */}
            <h2 className="text-sm font-semibold text-slate-700">
              {title}
            </h2>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              
              {/* Search */}
              <div className="w-72">
                <SearchField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  showResults={false}
                />
              </div>

              {/* Filter */}
              <FilterDropdown
                value={filterValue}
                onChange={setFilterValue}
                options={filterOptions}
                placeholder="Filter by status"
              />

            </div>

          </div>
        </th>
      </tr>

      {/* Column Headers */}
      <tr className="border-t border-slate-200">
        {columns.map((col) => (
          <th
            key={col.accessor}
            className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wider text-[11px]"
          >
            {col.header}
          </th>
        ))}

        <th className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wider text-[11px] text-right">
          Actions
        </th>
      </tr>

    </thead>
  );
}