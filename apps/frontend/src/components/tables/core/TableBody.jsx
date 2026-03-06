import { TableEmpty } from "./TableEmpty";
import { TableRow } from "./TableRow";

export const TableBody = ({ columns = [], data = [], actions = [] }) => {
  if (!data.length) {
    return <TableEmpty colSpan={columns.length + 1} />;
  }

  return (
    <tbody className="divide-y divide-slate-100">
      {data.map((row, index) => (
        <TableRow
          key={index}
          columns={columns}
          row={row}
          actions={actions}
        />
      ))}
    </tbody>
  );
};