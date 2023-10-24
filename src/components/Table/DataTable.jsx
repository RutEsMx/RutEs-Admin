"use client";
import { useEffect, useState, useMemo } from "react";
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
import { deleteParents, getParents } from "@/services/ParentsSevices";
import { setAlert } from "@/store/useSystemStore";
import { getDrivers } from "@/services/DriverServices";
import { getUnits } from "@/services/UnitsServices";
import { getStudents } from "@/services/StudentsServices";
import { getAuxiliars } from "@/services/AuxiliarsServices";

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
  
  useEffect(() => {
    const getData = async () => {
      if (type === "units") {
        getUnits()
      }
      if (type === "drivers") {
        getDrivers()
      }
      if(type === "parents"){
        getParents()
      }
      if(type === "students"){
        getStudents()
      }
      if(type === "auxiliars"){
        getAuxiliars()
      }
      if(type === "schools"){
        console.log("get schools")
      }
      if(type === "users"){
        console.log("get users")
      }
    }
    getData()
  }, []);

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
  

  // const handleDelete = async () => {
  //   if (type === "parents") {
  //     return deleteParents(rowSelection)
  //       .then((data) => {
  //         if (data?.error && data?.redirect) {
  //           removeCookies();
  //           return router.push(data?.redirect);
  //         }
  //         setAlert({
  //           type: "success",
  //           message: "Padres eliminados correctamente",
  //         });
  //         fetchDataParents({
  //           schoolId: profile?.schoolId,
  //           pageIndex,
  //           pageSize,
  //         }).then((data) => {
  //           setData(data);
  //         });
  //       })
  //       .catch((error) => {
  //         setAlert({ type: "error", message: error?.message });
  //       });
  //   }
  // };

  return (
    <>
      <div className="flex justify-end">
        <FilterInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Buscar"
        />
      </div>
      <div className="grid grid-cols-4 gap-1">
        <div className="col-span-1">
          {type === "parents" && (
            <div className="flex items-center">
              {/* <ButtonAction onClick={handleDelete} color="bg-light-gray">
                Eliminar
              </ButtonAction> */}
              {/* <ButtonAction onClick={handleSuspend}>Suspender</ButtonAction>
                <ButtonAction onClick={handleReactivate}>Reactivar</ButtonAction> */}
            </div>
          )}
        </div>
        <div className="col-span-1 flex items-center justify-end gap-2">
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
        <div className="col-span-2 flex justify-between items-center">
          <div className="flex flex-1 justify-center">
            <span>
              <strong>
                {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </strong>
            </span>
          </div>
          <div className="flex flex-1 justify-center">
            <span>
              | Ir a:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16 ms-2"
              />
            </span>
          </div>
          <div className="flex flex-1 justify-center">
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
                  <th className="bg-yellow" key={header.id}>
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
