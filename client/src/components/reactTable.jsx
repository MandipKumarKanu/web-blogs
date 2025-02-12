import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const DataTable = ({
  columns,
  data,
  customCss,
  extraHtml,
  totalPages,
  onPageChange,
  currentPage,
  isLoading,
}) => {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    data: useMemo(() => data, [data]),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  const handlePageChange = (newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="">
      <div className="p-6">
        <div
          className={`flex ${
            extraHtml ? "justify-between" : "justify-end"
          } items-center mb-6`}
        >
          {extraHtml && extraHtml}
          <div className="relative bg-card">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
              placeholder="Search..."
              className="pl-10 w-[280px] transition-all duration-200 focus:w-[320px]"
            />
          </div>
        </div>

        <div
          className={`max-w-full bg-card overflow-x-auto h-[35.5rem] ${customCss} rounded-lg border border-border`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <table className="w-full table-auto">
              <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`
                          ${header.column.columnDef.meta?.className ?? ""} 
                          min-w-[220px] py-4 px-4 font-medium text-foreground xl:pl-11
                          ${
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          }
                          transition-colors hover:bg-muted/80
                        `}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <div className="ml-2 transition-transform duration-200 hover:scale-110">
                              {renderSortingIcon(header.column)}
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-muted/50 group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`
                          ${cell.column.columnDef.meta?.className ?? ""}
                          py-4 px-4 xl:pl-11
                          group-hover:first:rounded-l group-hover:last:rounded-r
                        `}
                      >
                        <div
                          className="max-w-[150px] truncate"
                          title={
                            typeof cell.getValue() === "string"
                              ? cell.getValue()
                              : JSON.stringify(cell.getValue())
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className="rounded-md"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="rounded-md"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderSortingIcon = (column) => {
  const sortingIcon = {
    asc: <ArrowUp className="h-4 w-4 text-primary" />,
    desc: <ArrowDown className="h-4 w-4 text-primary" />,
    default: <ArrowUpDown className="h-4 w-4 text-muted-foreground" />,
  };

  return sortingIcon[column.getIsSorted() || "default"];
};

export default DataTable;
