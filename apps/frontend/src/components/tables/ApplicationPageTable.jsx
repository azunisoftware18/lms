import { Eye } from "lucide-react";
import Pagination from "../common/Pagination";
import { TableShell } from "./core";

export default function ApplicationPageTable({
  paginatedApplications = [],
  tableColumns = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  shouldShowLoadingOnly = false,
  onViewDetails = () => {},
}) {
  return (
    <TableShell>
      <thead className="bg-slate-50 border-b border-slate-300">
        <tr>
          {tableColumns.map((column) => (
            <th
              key={column.accessor}
              className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-600 uppercase tracking-wider text-[10px] sm:text-[11px] whitespace-nowrap"
            >
              {column.header}
            </th>
          ))}
          <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-600 uppercase tracking-wider text-[10px] sm:text-[11px] text-right whitespace-nowrap">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {shouldShowLoadingOnly ? (
          <tr>
            <td
              colSpan={tableColumns.length + 1}
              className="px-6 py-10 text-center text-slate-500"
            >
              Loading applications...
            </td>
          </tr>
        ) : paginatedApplications.length === 0 ? (
          <tr>
            <td
              colSpan={tableColumns.length + 1}
              className="px-6 py-10 text-center text-slate-500"
            >
              No applications found.
            </td>
          </tr>
        ) : (
          paginatedApplications.map((application, index) => {
            const isLast = index === paginatedApplications.length - 1;

            return (
              <tr
                key={application.id || index}
                className="hover:bg-blue-50/50 transition-colors duration-150"
              >
                {tableColumns.map((column) => (
                  <td
                    key={column.accessor}
                    className={`px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-slate-700 ${
                      !isLast ? "border-b border-slate-200" : ""
                    }`}
                  >
                    {column.render
                      ? column.render(application[column.accessor], application)
                      : application[column.accessor]}
                  </td>
                ))}

                <td
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-right ${
                    !isLast ? "border-b border-slate-200" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onViewDetails(application)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    <Eye size={14} />
                    View
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </TableShell>
  );
}
