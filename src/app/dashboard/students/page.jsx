"use client";
import LogoLayout from "@/components/LogoLayout";
import DataTable from "@/components/Table/DataTable";
import ButtonLink from "@/components/ButtonLink";
import { useStudentsStore } from "@/store/useStudentsStore";

const Students = () => {
  const { students, loading } = useStudentsStore();

  // Data is now handled by the global listener in DashboardLayout

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <LogoLayout />
        <div className="flex flex-wrap gap-3 justify-end items-center">
          <ButtonLink icon="plus" href="/dashboard/students/create">
            Agregar
          </ButtonLink>
          <ButtonLink icon="upload" href="/dashboard/students/bulk-upload">
            Carga masiva
          </ButtonLink>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Cargando datos de estudiantes...
          </div>
        ) : (
          <DataTable type="students" list={students} />
        )}
      </div>
    </div>
  );
};

export default Students;
