// TableBody.jsx - Updated with responsive handling
import TableEmpty from "./TableEmpty";
import TableRow from "./TableRow";

export default function TableBody({ columns = [], data = [], actions = [] }) {
  if (!data.length) {
    return <TableEmpty colSpan={columns.length + 1} />;
  }

  return (
    <tbody className="divide-y divide-slate-100">
      {data.map((row, index) => (
        <TableRow
          key={row.id || index}
          columns={columns}
          row={row}
          actions={actions}
          isLast={index === data.length - 1}
        />
      ))}
    </tbody>
  );
}