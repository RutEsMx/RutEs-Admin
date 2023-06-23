import { createColumnHelper } from "@tanstack/table-core"
import HeaderTable from "@/components/Table/elements/HeaderTable"
import CellTable from "@/components/Table/elements/CellTable"
import CheckboxTable from "@/components/Table/elements/CheckboxTable"
import { STATUS, STATUS_TRAVEL } from "@/utils/options"
import { CheckCircleIcon, NoSymbolIcon } from "@heroicons/react/24/outline"

const COLORS = {
  active: "text-green",
  inactive: "text-red",
  absent: "text-yellow",
  toSchool: "text-green",
  toHome: "text-blue",
}

const columnHelper = createColumnHelper()

const studentsColumns = [
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
    header: () => <HeaderTable>Estudiante</HeaderTable>,
    accessorKey: 'students',
    accessorFn: (data) => {
      const { students } = data
      return `${students.name} ${students.lastName} ${students.secondLastName}`
    },
    cell: (data) => {
      const { row } = data
      return (
        <div
          className='flex flex-row items-center cursor-pointer'
          onClick={() => console.log('>>>>Estudiante', row?.original?.id)}
        >
          {data.getValue()}
        </div>
      )
    },
  },
  // {
  //   header: () => <HeaderTable>Padre/Madre</HeaderTable>,
  //   accessorKey: 'parents',
  //   accessorFn: (data) => {
  //     const { name, lastName, secondLastName } = data
  //     return `${name} ${lastName} ${secondLastName}`
  //   },
  //   cell: (data) => {
  //     const { row } = data

  //     return <div
  //       className='flex flex-row items-center cursor-pointer'
  //       onClick={() => console.log('>>>>Padre/Madre', row?.original?.id)}
  //     >
  //       {data.getValue()}

  //     </div>
  //   },
  // },
  {
    header: () => <HeaderTable>Estado</HeaderTable>,
    accessorKey: 'statusTravel',
    cell: (data) => {
      const { row } = data
      const isActive = row?.original?.students?.status === 'active'
      if (!isActive) return null
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
      const { row } = data
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
  columnHelper.accessor('route', {
    cell: info => info.getValue(),
    header: () => <HeaderTable>Ruta</HeaderTable>,
  }),
]

const parentsColumns = [
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
      if (!isActive) return null
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
      const { row } = data
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

const COLUMNS = {
  'parents': parentsColumns,
  'students': studentsColumns,
  'auxiliars': [],
  'drivers': [],
  'units': [],
}

export default function ColumnSelected(type) {
  console.log('🚀 ~ file: index.js ~ line 169 ~ ColumnSelected ~ type', type);
  console.log('🚀 ~ file: index.js ~ line 169 ~ ColumnSelected ~ COLUMNS[type]', COLUMNS[type])
  return  COLUMNS[type]
}