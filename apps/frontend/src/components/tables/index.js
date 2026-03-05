import TableRoot from './Table';
import TableHead from './TableHead';
import TableBody from './TableBody';
import TableRow from './TableRow';
import TableCell from './TableCell';
import TableEmpty from './TableEmpty';
import TableLoader from './TableLoader';

export const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  Empty: TableEmpty,
  Loader: TableLoader,
});

// Taaki single components bhi import ho sakein
export { TableHead, TableBody, TableRow, TableCell, TableEmpty, TableLoader };