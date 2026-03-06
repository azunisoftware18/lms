export const TableHead = ({ columns = [] }) => {
  return (
    <thead className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
      <tr>
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
};