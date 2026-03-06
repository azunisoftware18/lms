export const TableEmpty = ({ colSpan }) => {
  return (
    <tbody>
      <tr>
        <td colSpan={colSpan} className="py-20 text-center">
          <div className="flex flex-col items-center justify-center opacity-40">
            <div className="bg-slate-100 p-4 rounded-full mb-3">
               {/* Search icon placeholder */}
               <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <p className="text-slate-500 font-semibold italic">No records found</p>
          </div>
        </td>
      </tr>
    </tbody>
  );
};