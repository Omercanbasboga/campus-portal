import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Box from "./Box";
import Text from "./Text";
import Input from "./Input";

// Column shape follows react-table: { Header, accessor, Cell, width, align }.
// With manualPagination the rows are already one page from the server and the
// caller owns paging; otherwise paging and the search box work on the client.
function DataTable({
  table,
  entriesPerPage,
  canSearch,
  showTotalEntries,
  manualPagination,
  pageCount,
  currentPage,
  totalElements,
  onPageChange,
  onEntriesChange,
  filterNode,
  filterNodeLeft,
  paginationNode,
  noEndBorder,
  emptyText,
}) {
  const { columns, rows } = table;
  const sizes = entriesPerPage?.entries || [10, 25, 50];
  const [size, setSize] = useState(entriesPerPage?.defaultValue || sizes[0]);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (manualPagination || !query) return rows;
    const q = query.toLocaleLowerCase("tr-TR");
    return rows.filter((r) =>
      columns.some((c) => {
        const v = typeof c.accessor === "string" ? r[c.accessor] : null;
        return typeof v === "string" || typeof v === "number"
          ? String(v).toLocaleLowerCase("tr-TR").includes(q)
          : false;
      })
    );
  }, [rows, columns, query, manualPagination]);

  const shown = manualPagination ? rows : filtered.slice(page * size, page * size + size);
  const total = manualPagination ? (totalElements ?? rows.length) : filtered.length;
  const current = manualPagination ? currentPage : page;

  const changeSize = (e) => {
    const n = Number(e.target.value);
    setSize(n);
    setPage(0);
    onEntriesChange?.(n);
  };
  const changePage = (_, p) => {
    if (manualPagination) onPageChange?.(p);
    else setPage(p);
  };

  const renderCell = (col, row) => {
    const value = typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor];
    if (col.Cell) return col.Cell({ row: { original: row, values: row }, value });
    return value ?? "";
  };

  return (
    <Box>
      {(filterNode || filterNodeLeft || canSearch) && (
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" px={2} py={2}>
          {filterNodeLeft}
          {canSearch && (
            <Box width="18rem">
              <Input
                placeholder="Ara"
                icon={{ component: "search", direction: "left" }}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
              />
            </Box>
          )}
          {filterNode}
        </Box>
      )}

      <TableContainer>
        <Table size="small" sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              {columns.map((c, i) => (
                <TableCell
                  key={c.id || c.accessor || i}
                  align={c.align || "left"}
                  sx={{ width: c.width }}
                >
                  {c.Header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {shown.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Text variant="body2" color="text" py={3} textAlign="center">
                    {emptyText}
                  </Text>
                </TableCell>
              </TableRow>
            )}
            {shown.map((row, ri) => (
              <TableRow key={row.id ?? ri} hover>
                {columns.map((c, ci) => (
                  <TableCell
                    key={c.id || c.accessor || ci}
                    align={c.align || "left"}
                    sx={noEndBorder && ri === shown.length - 1 ? { borderBottom: 0 } : undefined}
                  >
                    {renderCell(c, row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {paginationNode ? (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          p={2}
        >
          {showTotalEntries && (
            <Text variant="body2" color="text">
              Toplam {Number(total).toLocaleString("tr-TR")} kayıt
            </Text>
          )}
          {paginationNode}
        </Box>
      ) : (
        <TablePagination
          component="div"
          count={manualPagination && pageCount ? Math.max(total, pageCount * size) : total}
          page={Math.max(0, current)}
          rowsPerPage={size}
          rowsPerPageOptions={sizes}
          onPageChange={changePage}
          onRowsPerPageChange={changeSize}
          labelRowsPerPage="Sayfa başına"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} / ${count}`}
        />
      )}
    </Box>
  );
}

DataTable.propTypes = {
  table: PropTypes.shape({ columns: PropTypes.array, rows: PropTypes.array }).isRequired,
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  manualPagination: PropTypes.bool,
  pageCount: PropTypes.number,
  currentPage: PropTypes.number,
  totalElements: PropTypes.number,
  onPageChange: PropTypes.func,
  onEntriesChange: PropTypes.func,
  filterNode: PropTypes.node,
  filterNodeLeft: PropTypes.node,
  paginationNode: PropTypes.node,
  noEndBorder: PropTypes.bool,
  emptyText: PropTypes.string,
};
DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: [10, 25, 50] },
  canSearch: false,
  showTotalEntries: true,
  manualPagination: false,
  currentPage: 0,
  emptyText: "Kayıt bulunamadı.",
};

export default DataTable;
