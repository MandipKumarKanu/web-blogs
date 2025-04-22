import { useState, useMemo } from "react";
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
  blogStyle = false, 
  hideSearch = false, 
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

  const getHeaderClassNames = (header) => {
    return blogStyle
      ? `px-4 py-2 text-left text-sm font-medium text-muted-foreground ${
          header.column.columnDef.meta?.className ?? ""
        } ${
          header.column.getCanSort() ? "cursor-pointer select-none" : ""
        }`
      : `${
          header.column.columnDef.meta?.className ?? ""
        } min-w-[220px] py-4 px-4 font-medium text-foreground xl:pl-11 ${
          header.column.getCanSort() ? "cursor-pointer select-none" : ""
        } transition-colors hover:bg-muted/80`;
  };

  const getCellClassNames = (cell) => {
    return blogStyle
      ? `px-4 py-2 text-sm text-foreground ${
          cell.column.columnDef.meta?.className ?? ""
        }`
      : `${
          cell.column.columnDef.meta?.className ?? ""
        } py-4 px-4 xl:pl-11 group-hover:first:rounded-l group-hover:last:rounded-r`;
  };

  const getRowClassNames = (index) => {
    return blogStyle
      ? `border-t border-border ${
          index % 2 === 0 ? "bg-muted/5" : "bg-card"
        }`
      : "transition-colors hover:bg-muted/50 group";
  };

  return (
    <div className="">
      {data ? (
        <div className="p-6">
      
        {!hideSearch && (
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
        )}
        
        <div
          className={`max-w-full ${
            blogStyle 
              ? "overflow-x-auto"
              : `bg-card overflow-x-auto h-[35.5rem] ${customCss} rounded-lg border border-border`
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <table className={blogStyle ? "min-w-full" : "w-full table-auto"}>
              <thead className={blogStyle ? "bg-muted/10" : "sticky top-0 z-10 bg-muted/80 backdrop-blur supports-[backdrop-filter]:bg-muted/60"}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={getHeaderClassNames(header)}
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
              <tbody className={blogStyle ? "" : "divide-y divide-border"}>
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={getRowClassNames(index)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={getCellClassNames(cell)}
                      >
                        <div
                          className={blogStyle ? "" : "max-w-[150px] truncate"}
                          title={
                            typeof cell.getValue() === "string"
                              ? cell.getValue()
                              : JSON.stringify(cell.getValue())
                          }
                        >
                          {cell.column.id === "title" ? (
                            <div
                              className="cursor-pointer relative"
                              onMouseEnter={() => {
                                if (blogStyle && row.original._id) {
                                  window.setHoveredBlog?.(row.original._id);
                                  window.setMouseX?.(window.event.clientX);
                                  window.setMouseY?.(window.event.clientY);
                                }
                              }}
                              onMouseMove={(e) => {
                                if (blogStyle && row.original._id) {
                                  window.setMouseX?.(e.clientX);
                                  window.setMouseY?.(e.clientY);
                                }
                              }}
                              onMouseLeave={() => {
                                if (blogStyle) window.setHoveredBlog?.(null);
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
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
        
        {blogStyle ? (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              Previous
            </Button>
            <p>
              Page {currentPage} of {totalPages}
            </p>
            <Button
              variant="outline"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                className="rounded-md"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
                className="rounded-md"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
        </div>
      ) : null}
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