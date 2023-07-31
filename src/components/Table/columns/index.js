import { createColumnHelper } from "@tanstack/table-core";
import HeaderTable from "@/components/Table/elements/HeaderTable";
import CellTable from "@/components/Table/elements/CellTable";
import CheckboxTable from "@/components/Table/elements/CheckboxTable";
import { STATUS_TRAVEL } from "@/utils/options";
import {
  CheckCircleIcon,
  NoSymbolIcon,
  BuildingLibraryIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const COLORS = {
  active: "text-green",
  inactive: "text-red",
  absent: "text-yellow",
  toSchool: "text-green",
  toHome: "text-blue",
};

const columnHelper = createColumnHelper();

const studentsColumns = [
  columnHelper.accessor("select", {
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
    header: ({ table }) => (
      <HeaderTable>
        <CheckboxTable
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      </HeaderTable>
    ),
  }),
  {
    header: () => <HeaderTable>Estudiante</HeaderTable>,
    accessorKey: "students",
    accessorFn: (data) => {
      return `${data.name} ${data.lastName} ${data.secondLastName}`;
    },
    cell: (data) => {
      const { row } = data;
      return (
        <div className="flex flex-row items-center cursor-pointer">
          <Link href={`/dashboard/students/${row?.original?.id}`}>
            {data.getValue()}
          </Link>
        </div>
      );
    },
  },
  {
    header: () => <HeaderTable>Estado</HeaderTable>,
    accessorKey: "statusTravel",
    cell: (data) => {
      const { row } = data;
      const isActive = row?.original?.status === "active";
      if (!isActive) return null;
      const colorStatusTravel = COLORS[data.getValue()] ?? "";
      return (
        <div className="flex flex-row items-center justify-center">
          <CellTable className={colorStatusTravel}>
            {STATUS_TRAVEL[data.getValue()]}
          </CellTable>
        </div>
      );
    },
  },
  {
    header: () => <HeaderTable>Servicio</HeaderTable>,
    accessorKey: "service",
    cell: (data) => {
      const { row } = data;
      const isActive = row?.original?.status === "active";
      return (
        <div className="flex flex-row items-center justify-center">
          <CellTable>
            {isActive ? (
              <CheckCircleIcon className="h-5 w-5 text-green" />
            ) : (
              <NoSymbolIcon className="h-5 w-5 text-red" />
            )}
          </CellTable>
        </div>
      );
    },
  },
  columnHelper.accessor("dayRoute", {
    cell: (info) => {
      return (
        <div className="flex flex-row items-center justify-center">
          <CellTable>{info.getValue()?.route?.nameRoute}</CellTable>
        </div>
      );
    },
    header: () => <HeaderTable>Ruta</HeaderTable>,
  }),
];

const parentsColumns = [
  columnHelper.accessor("select", {
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
    header: ({ table }) => (
      <HeaderTable>
        <CheckboxTable
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      </HeaderTable>
    ),
  }),
  {
    header: () => <HeaderTable>Padre/Madre</HeaderTable>,
    accessorKey: "parents",
    accessorFn: (data) => {
      const { name, lastName, secondLastName } = data;
      return `${name} ${lastName} ${secondLastName}`;
    },
    cell: (data) => {
      const { row } = data;

      return (
        <Link href={`/dashboard/parents/edit/${row?.original?.id}`}>
          {data.getValue()}
        </Link>
      );
    },
  },
  {
    header: () => <HeaderTable>Estudiante</HeaderTable>,
    accessorKey: "students",
    accessorFn: (data) => {
      const { students } = data;
      return students
        ?.map((student) => {
          return `${student.name} ${student.lastName} ${student.secondLastName}`;
        })
        .join(",");
    },
    cell: (data) => {
      const dataFormat = data.getValue()?.split(",");
      return (
        <div className="flex flex-col">
          {dataFormat?.map((student, index) => {
            return <div key={index}>{student}</div>;
          })}
        </div>
      );
    },
  },
  {
    header: () => <HeaderTable>Servicio</HeaderTable>,
    accessorKey: "service",
    cell: (data) => {
      const { row } = data;
      const isActive = row?.original?.status === "active";
      return (
        <div className="flex flex-row items-center justify-center">
          <CellTable>
            {isActive ? (
              <CheckCircleIcon className="h-5 w-5 text-green" />
            ) : (
              <NoSymbolIcon className="h-5 w-5 text-red" />
            )}
          </CellTable>
        </div>
      );
    },
  },
  columnHelper.accessor("phone", {
    cell: (info) => info.getValue(),
    header: () => <HeaderTable>Teléfono</HeaderTable>,
  }),
  columnHelper.accessor("email", {
    cell: (info) => info.getValue(),
    header: () => <HeaderTable>Correo electrónico</HeaderTable>,
    enableGlobalFilter: false,
  }),
];

const usersColumns = [
  columnHelper.accessor("select", {
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
    header: () => <HeaderTable>Seleccionar</HeaderTable>,
  }),
  {
    header: () => <HeaderTable>Nombre</HeaderTable>,
    accessorKey: "name",
    cell: (data) => {
      const { row } = data;
      return (
        <Link href={`/dashboard/admin/users/edit/${row?.original?.id}`}>
          {data.getValue()}
        </Link>
      );
    },
  },
  {
    header: () => <HeaderTable>Correo electrónico</HeaderTable>,
    accessorKey: "email",
  },
  {
    header: () => <HeaderTable>Roles</HeaderTable>,
    accessorKey: "roles",
    cell: (data) => {
      const roles = data.getValue();

      return (
        <div className="flex flex-row items-center justify-center">
          <CellTable>
            <div className="flex flex-row items-center justify-center">
              {roles.map((role) => {
                if (role === "admin") {
                  return (
                    <BuildingLibraryIcon
                      className="h-5 w-5 text-green"
                      key={role}
                    />
                  );
                } else if (role === "user-school") {
                  return <UserIcon className="h-5 w-5 text-blue" key={role} />;
                } else if (role === "admin-rutes") {
                  return (
                    <UserIcon
                      className="h-5 w-5 text-yellow-pressed"
                      key={role}
                    />
                  );
                }
              })}
            </div>
          </CellTable>
        </div>
      );
    },
  },
  {
    header: () => <HeaderTable>Estado</HeaderTable>,
    accessorKey: "status",
  },
];

const schoolsColumns = [
  {
    header: () => <HeaderTable>Nombre</HeaderTable>,
    accessorKey: "name",
    cell: (data) => {
      const { row } = data;
      return (
        <Link href={`/dashboard/admin/schools/edit/${row?.original?.id}`}>
          {data.getValue()}
        </Link>
      );
    },
  },
  {
    header: () => <HeaderTable>Clave</HeaderTable>,
    accessorKey: "clave",
  },
  {
    header: () => <HeaderTable>Correo electrónico</HeaderTable>,
    accessorKey: "email",
  },
  {
    header: () => <HeaderTable>Teléfono</HeaderTable>,
    accessorKey: "phone",
  },
  {
    header: () => <HeaderTable>Dirección</HeaderTable>,
    accessorKey: "address",
  },
];

const COLUMNS = {
  parents: parentsColumns,
  students: studentsColumns,
  auxiliars: [],
  drivers: [],
  units: [],
  users: usersColumns,
  schools: schoolsColumns,
};

export default function ColumnSelected(type) {
  return COLUMNS[type];
}
