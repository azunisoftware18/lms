import Pagination from "../common/Pagination";
import { TableShell, TableHead, TableBody } from "./core";

export default function EMIScheduleTableView({
  title = "",
  columns = [],
  data = [],
  actions = [],
  search = "",
  onSearchChange = () => {},
  filterValue = "",
  onFilterChange = () => {},
  filterOptions = [],
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
          filterValue={filterValue}
          setFilterValue={onFilterChange}
          filterOptions={filterOptions}
        />
        <TableBody columns={columns} data={data} actions={actions} />
      </TableShell>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
