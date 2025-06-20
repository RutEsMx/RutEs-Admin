"use client";
import { useEffect } from "react";
import LogoLayout from "@/components/LogoLayout";
import DataTable from "@/components/Table/DataTable";
import ButtonLink from "@/components/ButtonLink";
import { useStudentsStore, setLoading } from "@/store/useStudentsStore";
import { getStudents } from "@/services/StudentsServices";

const Students = () => {
  const { students, loading } = useStudentsStore();

  useEffect(() => {
    setLoading(true);
    getStudents().finally(() => setLoading(false));
  }, []);

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
        {!loading && <DataTable type="students" list={students} />}
      </div>
    </div>
  );
};

export default Students;
