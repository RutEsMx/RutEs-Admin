"use client";
import DataTable from "@/components/Table/DataTable";
import ButtonLink from "@/components/ButtonLink";
import { useStudentsStore } from "@/store/useStudentsStore";
import StudentsLoading from "./loading";
import TableShell from "@/components/Table/TableShell";

const Students = () => {
  const { students, loading } = useStudentsStore();

  if (loading) {
    return <StudentsLoading />;
  }

  return (
    <TableShell
      rightActions={
        <>
          <ButtonLink icon="plus" href="/dashboard/students/create">
            Agregar
          </ButtonLink>
          <ButtonLink icon="upload" href="/dashboard/students/bulk-upload">
            Carga masiva
          </ButtonLink>
        </>
      }
    >
      {students?.rows?.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No hay estudiantes registrados.
        </div>
      ) : (
        <DataTable type="students" list={students} />
      )}
    </TableShell>
  );
};

export default Students;
