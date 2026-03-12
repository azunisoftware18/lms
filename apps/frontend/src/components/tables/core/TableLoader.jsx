// TableLoader.jsx - Updated with responsive loader
export default function TableLoader({ colSpan }) {
  return (
    <tbody>
      <tr>
        <td colSpan={colSpan} className="py-12 sm:py-16 md:py-20">
          <div className="flex flex-col items-center justify-center gap-3">
            {/* Animated Spinner */}
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 border-3 border-transparent border-t-blue-300 rounded-full animate-ping opacity-20" />
            </div>
            
            {/* Loading Text */}
            <div className="space-y-1 text-center">
              <span className="text-slate-500 font-medium text-xs sm:text-sm animate-pulse block">
                Fetching data...
              </span>
              <span className="text-slate-400 text-[10px] sm:text-xs block">
                Please wait a moment
              </span>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  );
}