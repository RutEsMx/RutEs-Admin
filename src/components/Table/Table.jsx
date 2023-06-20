'use client'
import { useEffect, useRef, useState } from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import HeaderTable from './HeaderTable';
import CellTable from './CellTable';
import ButtonAction from './ButtonAction';
import CheckboxTable from './CheckboxTable';
import { COLORS, STATUS } from '@/utils/options';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('select', {
    cell: ({row}) => (
      <div className="flex justify-center">
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
    header: ({table}) => <HeaderTable>
      <CheckboxTable 
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    </HeaderTable>,
  }),
  columnHelper.accessor('tutors', {
    cell: info => info.getValue().map(tutor => (
      <div className='cursor-pointer' onClick={() => console.log('Tutor', tutor?.id)}>
        <CellTable key={tutor.name}>{tutor.name}</CellTable>
      </div>
    )),
    header: () => <HeaderTable>TUTORES</HeaderTable>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('students', {
    cell: info => (
      <div className='flex flex-row cursor-pointer' onClick={() => console.log('>>>>Estudiante', info.getValue())}>
        <CellTable key={info.getValue().id}>
          {info.getValue().name}
        </CellTable>
        {
          info.getValue().statusTravel && (
            <CellTable key={info.getValue().id} className={COLORS[info.getValue().statusTravel]}>
              {STATUS[info.getValue().statusTravel]}
            </CellTable>
          )
        }
        {
          info.getValue().status && (
            <CellTable key={info.getValue().id} className={COLORS[info.getValue().status]}>
              {STATUS[info.getValue().status]}
            </CellTable>
          )
        }
      </div>
    ),
    header: () => <HeaderTable>Alumno(s)</HeaderTable>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('phone', {
    cell: info => info.getValue(),
    header: () => <HeaderTable>Teléfono</HeaderTable>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('email', {
    cell: info => info.getValue(),
    header: () => <HeaderTable>Correo electrónico</HeaderTable>,
    footer: info => info.column.id,
  }),
]

const DataTable = () => {
  const [data, setData] = useState(
    [
      {
        "id": 135662,
        "tutors": [
          {
            "id": "asdx2312",
            "name": "Jonathan Blanco Hernandez",
            "phone": "1234567890",
          },
          {
            "id": "asdx2314",
            "name": "Gabriela Maldonado de la Cruz",
            "phone": "1234567890",
          },
        ],
        "students": {
          "id": 135662,
          "name": "Johan Gabriel Blanco Maldonado",
          "phone": "1234567890",
        },
        "phone": "1234567890",
        "email": "example@rutes.mx",
      },
      {
        "id": 235662, // id de estudiante, vamos a ajustar a un estudiante por fila
        "tutors": [
          {
            "id": "asdx2316",
            "name": "Luis Hernandez Vazquez",
            "phone": "1234567890",
          },
        ],
        "students": {
          "id": 235662,
          "name": "Karla Hernandez Vazquez",
          "phone": "1234567890",
        },
        "phone": "1234567890",
        "email": "example2@rutes.mx",
      },

    ])
  const [rowSelection, setRowSelection] = useState([])
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    getRowId: row => row.id,
  })
  
  
  // onClick eliminar el rowSelection
  function handleDelete() {
    const newData = data.map(item => {
      if (rowSelection[item.id]) {
        item.students.status = 'inactive'
      }
      return item
    })
    setData(newData)
  }
  // onClick suspender el rowSelection
  function handleSuspend() {
    const newData = data.map(item => {
      if (rowSelection[item.id]) {
        if (item.students.statusTravel === 'absent') {
          item.students.statusTravel = null
        } else {
          item.students.statusTravel = 'absent'
        }
      }
      return item
    })
    setData(newData)
  }
  
  // onClick reactivar el rowSelection
  function handleReactivate() {
    const newData = data.map(item => {
      if (rowSelection[item.id]) {
        if (item.students.status === 'inactive') {
          item.students.status = null
        } 
      }
      return item
    })
    setData(newData)
  }
  
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex justify-around md:flex-row sm:flex-col ">
          <ButtonAction onClick={handleDelete}>Eliminar</ButtonAction>
          <ButtonAction onClick={handleSuspend}>Suspender</ButtonAction>
          <ButtonAction onClick={handleReactivate}>Reactivar</ButtonAction>
        </div>
        <div className="col-start-2 flex items-center justify-end">
          Pagination
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

export default DataTable

