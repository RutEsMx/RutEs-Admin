'use client'
import { useEffect, useState, useMemo, use } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import HeaderTable from './HeaderTable';
import CellTable from './CellTable';
import ButtonAction from './ButtonAction';
import CheckboxTable from './CheckboxTable';
import { STATUS, STATUS_TRAVEL } from '@/utils/options';
import { fetchData } from '@/services/TableServices';
import { CheckCircleIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import FilterInput from './FilterInputTable';

const columnHelper = createColumnHelper();

const fuzzyFilter = (row, columnId, value, addMeta) => {
  console.log("🚀 ~ file: Table.jsx:24 ~ fuzzyFilter ~ columnId:", columnId)
  const itemRank = rankItem(row.getValue(columnId), value)
  console.log("🚀 ~ file: Table.jsx:26 ~ fuzzyFilter ~ itemRank:", itemRank)

  addMeta({
    itemRank,
  })

  return itemRank.passed
}

const COLORS = {
  active: "text-green",
  inactive: "text-red",
  absent: "text-yellow",
  toSchool: "text-green",
  toHome: "text-blue",
}

const DataTableParents = () => {
  const columns = useMemo(
    () => (
      [
        columnHelper.accessor('select', {
          cell: ({ row }) => (
            <div className="flex justify-center p-3">
              <CheckboxTable
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            </div>
          ),
          header: ({ table }) => <HeaderTable>
            <CheckboxTable
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          </HeaderTable>,
        }),
        {
          header: () => <HeaderTable>Padre/Madre</HeaderTable>,
          accessorKey: 'parents',
          accessorFn: (data) => {
            const { name, lastName, secondLastName } = data
            return `${name} ${lastName} ${secondLastName}`
          },
          cell: (data) => {
            const { row } = data
            
            return <div
              className='flex flex-row items-center cursor-pointer'
              onClick={() => console.log('>>>>Padre/Madre', row?.original?.id)}
            >
              {data.getValue()}
              
            </div>
          },
        },
        {
          header: () => <HeaderTable>Estudiante</HeaderTable>,
          accessorKey: 'students',
          accessorFn: (data) => {
            const { students } = data
            return `${students.name} ${students.lastName} ${students.secondLastName}`
          },
        },
        {
          header: () => <HeaderTable>Estado</HeaderTable>,
          accessorKey: 'statusTravel',
          cell: (data) => {
            const { row } = data
            const isActive = row?.original?.students?.status === 'active'
            if(!isActive) return null
            const colorStatusTravel = COLORS[row?.original?.students?.statusTravel] ?? ''
            return (
              <div
                className='flex flex-row items-center justify-center'
              >
                <CellTable className={colorStatusTravel} >
                  {STATUS_TRAVEL[row?.original?.students?.statusTravel]}
                </CellTable>
              </div>
            )
          },
        },
        {
          header: () => <HeaderTable>Servicio</HeaderTable>,
          accessorKey: 'service',
          cell: (data) => {
            const {row} = data
            const isActive = row?.original?.students?.status === 'active'
            return (
              <div
                className='flex flex-row items-center justify-center'
              >
                <CellTable>
                  {
                    isActive ? (
                      <CheckCircleIcon className='h-5 w-5 text-green' />
                    ) : (
                      <NoSymbolIcon className='h-5 w-5 text-red' />
                    )
                  }

                </CellTable>
              </div>
            )
          },
        },
        columnHelper.accessor('phone', {
          cell: info => info.getValue(),
          header: () => <HeaderTable>Teléfono</HeaderTable>,
        }),
        columnHelper.accessor('email', {
          cell: info => info.getValue(),
          header: () => <HeaderTable>Correo electrónico</HeaderTable>,
          enableGlobalFilter: false,
        }),
      ]
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
    fetchData({ pageIndex, pageSize }).then((data) => setData(data))
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
            {table.getRowModel()?.rows.map(row => {
              return <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return <td key={cell.id}>
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

export default DataTableParents

