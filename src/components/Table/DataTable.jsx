'use client'
import { useEffect, useState, useMemo, use } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import ButtonAction from '@/components/Table/elements/ButtonAction';
import { fetchData, fetchDataStudents } from '@/services/TableServices';
import FilterInput from '@/components/Table/elements/FilterInputTable';
import ColumnSelected from './columns';

const fuzzyFilter = (row, columnId, value, addMeta) => {
  console.log("🚀 ~ file: Table.jsx:24 ~ fuzzyFilter ~ columnId:", columnId)
  const itemRank = rankItem(row.getValue(columnId), value)
  console.log("🚀 ~ file: Table.jsx:26 ~ fuzzyFilter ~ itemRank:", itemRank)

  addMeta({
    itemRank,
  })

  return itemRank.passed
}


const DataTable = ({type}) => {
  const columns = useMemo(
    () => (
      ColumnSelected(type)
    ), []
  )
  const [data, setData] = useState(() => [])
  const [globalFilter, setGlobalFilter] = useState('')
  const [{ pageIndex, pageSize }, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
    })
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )
  const [rowSelection, setRowSelection] = useState([])

  useEffect(() => {
    if(type === 'parents') fetchData({ pageIndex, pageSize }).then((data) => setData(data))
    if(type === 'students') fetchDataStudents({ pageIndex, pageSize }).then((data) => setData(data))
  }, [pageIndex, pageSize])
      
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
    getRowId: row => row.id,
    onGlobalFilterChange: setGlobalFilter,
    filterFns: {
      myCustomFilter: fuzzyFilter
    },
    globalFilterFn: fuzzyFilter,
  })

  // onClick eliminar el rowSelection
  function handleDelete() {
    console.log("🚀 ~ handleDelete:", rowSelection)
  }
  // onClick suspender el rowSelection
  function handleSuspend() {
    console.log("🚀 ~ handleSuspend:", rowSelection)
  }
  
  function handleReactivate() {
    console.log("🚀 ~ handleReactivate:", rowSelection)
  }

  return (
    <>
      <div className="flex justify-end">
        <FilterInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder="Buscar"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex justify-around md:flex-row sm:flex-col ">
          <ButtonAction onClick={handleDelete}>Eliminar</ButtonAction>
          <ButtonAction onClick={handleSuspend}>Suspender</ButtonAction>
          <ButtonAction onClick={handleReactivate}>Reactivar</ButtonAction>
        </div>
        <div className="col-start-2 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <ButtonAction
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </ButtonAction>
            <ButtonAction
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </ButtonAction>
            <ButtonAction
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </ButtonAction>
            <ButtonAction
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </ButtonAction>
            <span className="flex items-center gap-1">
              <div>Pagina</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} de{' '}
                {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Ir a la pagina:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="border p-1 rounded w-16"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Mostrar {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>  
      <table className='table-fixed rounded-md border'>
          {table?.getHeaderGroups()?.map(headerGroup => (
            <thead key={headerGroup.id}>
              <tr>
              {headerGroup.headers.map(header => {
                return (
                  <th className='' key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </th>
                )
              })}
              </tr>
            </thead>
          ))}
          <tbody>
            {table.getRowModel()?.rows.map((row, index) => {
              let color = index % 2 === 0 ? 'bg-light-gray' : 'bg-white'
              return <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return <td key={cell.id} className={`${color}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                }
                )}
              </tr>
            })}
          </tbody>
      </table>
    </>
  )
}

export default DataTable

