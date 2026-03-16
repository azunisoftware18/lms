import Pagination from "../common/Pagination";
import { TableShell, TableHead, TableBody } from "./core";

export default function KycVerificationTable({
  title = "",
  columns = [],
  data = [],
  actions = [],
  search = "",
  onSearchChange = () => {},
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) {
  return (
    <>
      <TableShell>
        <TableHead
          title={title}
          columns={columns}
          search={search}
          setSearch={onSearchChange}
        />
        <TableBody columns={columns} data={data} actions={actions} />
      </TableShell>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
