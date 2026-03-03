"use client";
import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import ButtonAction from "@/components/ButtonAction";
import FilterInput from "@/components/Table/elements/FilterInputTable";
import ColumnSelected from "./columns";

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

const DataTable = ({ type, list = [] }) => {
  const columns = useMemo(() => ColumnSelected(type), []);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: list?.rows ?? [],
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getRowId: (row) => row.id,
    onGlobalFilterChange: setGlobalFilter,
    filterFns: {
      myCustomFilter: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
  });

  return (
    <>
      <div className="flex justify-end mt-4 mb-2">
        <FilterInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Buscar"
        />
      </div>

      <div className="flex items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-2">
          <ButtonAction
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </ButtonAction>
          <ButtonAction
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </ButtonAction>
          <ButtonAction
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </ButtonAction>
          <ButtonAction
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </ButtonAction>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="text-sm">
            <strong>
              {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount() || 1}
            </strong>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>| Ir a:</span>
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="hidden md:inline-block border rounded p-1"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto w-full mt-6">
        <table className="w-full table-auto rounded-md border border-gray-300 shadow-sm">
          {table.getHeaderGroups().map((headerGroup) => (
            <thead
              key={headerGroup.id}
              className="bg-primary text-white sticky top-0 z-10"
            >
              <tr>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-center px-4 py-3 text-sm font-semibold border-r border-white last:border-none"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            </thead>
          ))}

          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="even:bg-gray-50 hover:bg-gray-100 transition duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="text-center px-4 py-2 text-sm border-t border-gray-200"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-500"
                >
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DataTable;
