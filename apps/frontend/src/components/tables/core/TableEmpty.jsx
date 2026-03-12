// TableEmpty.jsx - Updated with responsive empty state
import { Search } from "lucide-react";

export default function TableEmpty({ colSpan }) {
  return (
    <tbody>
      <tr>
        <td colSpan={colSpan} className="py-12 sm:py-16 md:py-20 px-4 text-center">
          <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
            <div className="bg-slate-100 p-4 sm:p-5 rounded-full mb-4">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-semibold text-sm sm:text-base mb-1">
              No records found
            </p>
            <p className="text-slate-400 text-xs sm:text-sm">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );
}