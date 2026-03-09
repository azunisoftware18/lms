export default function TableLoader({ colSpan }) {
  return (
    <tbody>
      <tr>
        <td colSpan={colSpan} className="py-20">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-slate-400 font-medium animate-pulse">Fetching data...</span>
          </div>
        </td>
      </tr>
    </tbody>
  );
}