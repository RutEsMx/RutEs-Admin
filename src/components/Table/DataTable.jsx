"use client";
import { useEffect, useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import ButtonAction from "@/components/Table/elements/ButtonAction";
import {
  fetchDataParents,
  fetchDataSchools,
  fetchDataStudents,
  fetchDataUnits,
  fetchDataUsers,
} from "@/services/TableServices";
import FilterInput from "@/components/Table/elements/FilterInputTable";
import ColumnSelected from "./columns";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { removeCookies } from "@/services/CookiesServices";
import { deleteParents } from "@/services/ParentsSevices";
import { setAlert } from "@/store/useSystemStore";

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

const DataTable = ({ type, list = [] }) => {
  const { profile } = useAuthContext();
  const router = useRouter();
  const columns = useMemo(() => ColumnSelected(type), []);
  const [data, setData] = useState(list);
  const [globalFilter, setGlobalFilter] = useState("");
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );
  const [rowSelection, setRowSelection] = useState([]);

  useEffect(() => {
    if (type === "parents")
      fetchDataParents({
        schoolId: profile?.schoolId,
        pageIndex,
        pageSize,
      }).then((data) => {
        if (data?.error && data?.redirect) {
          removeCookies();
          return router.push(data?.redirect);
        }
        setData(data);
      });
    if (type === "students" && pageIndex !== 0)
      fetchDataStudents({
        schoolId: profile?.schoolId,
        pageIndex,
        pageSize,
      }).then((data) => {
        if (data?.error && data?.redirect) {
          removeCookies();
          return router.push(data?.redirect);
        }
        setData(data);
      });
    if (type === "users")
      fetchDataUsers({ pageIndex, pageSize }).then((data) => {
        if (data?.error && data?.redirect) {
          removeCookies();
          return router.push(data?.redirect);
        }
        setData(data);
      });
    if (type === "schools" && pageIndex !== 0) {
      fetchDataSchools({ pageIndex, pageSize: 1 }).then((data) => {
        if (data?.error && data?.redirect) {
          removeCookies();
          return router.push(data?.redirect);
        }
        setData(data);
      });
    }
    if (type === "units") {
      fetchDataUnits({ pageIndex, pageSize }).then((data) => {
        if (data?.error && data?.redirect) {
          removeCookies();
          return router.push(data?.redirect);
        }
        setData(data);
      });
    }
  }, [pageIndex, pageSize, profile]);

  const table = useReactTable({
    data: data?.rows ?? [],
    columns,
    pageCount: data?.pageCount ?? -1,
    state: {
      rowSelection,
      pagination,
      globalFilter,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    getRowId: (row) => row.id,
    onGlobalFilterChange: setGlobalFilter,
    filterFns: {
      myCustomFilter: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
  });

  const handleDelete = async () => {
    if (type === "parents") {
      return deleteParents(rowSelection)
        .then((data) => {
          if (data?.error && data?.redirect) {
            removeCookies();
            return router.push(data?.redirect);
          }
          setAlert({
            type: "success",
            message: "Padres eliminados correctamente",
          });
          fetchDataParents({
            schoolId: profile?.schoolId,
            pageIndex,
            pageSize,
          }).then((data) => {
            setData(data);
          });
        })
        .catch((error) => {
          setAlert({ type: "error", message: error?.message });
        });
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <FilterInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Buscar"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {type === "parents" && (
          <div className="flex items-center">
            <ButtonAction onClick={handleDelete} color="bg-light-gray">
              Eliminar
            </ButtonAction>
            {/* <ButtonAction onClick={handleSuspend}>Suspender</ButtonAction>
              <ButtonAction onClick={handleReactivate}>Reactivar</ButtonAction> */}
          </div>
        )}
        <div className="col-start-2">
          <div className="flex items-center justify-end gap-2">
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
            <span className="flex items-center gap-1">
              <div>Pagina</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1 md:hidden lg:flex">
              | Ir a la pagina:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="md:hidden lg:flex"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Mostrar {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <table className="table-fixed rounded-md border">
        {table?.getHeaderGroups()?.map((headerGroup) => (
          <thead key={headerGroup.id}>
            <tr>
              {headerGroup.headers.map((header) => {
                return (
                  <th className="" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                );
              })}
            </tr>
          </thead>
        ))}
        <tbody>
          {table.getRowModel()?.rows.map((row, index) => {
            let color = index % 2 === 0 ? "bg-light-gray" : "bg-white";
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} className={`${color}`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default DataTable;
