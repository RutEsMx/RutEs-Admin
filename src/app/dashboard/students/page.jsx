"use client";
import LogoLayout from "@/components/LogoLayout";
import DataTable from "@/components/Table/DataTable";
import ButtonLink from "@/components/ButtonLink";
import { useStudentsStore } from "@/store/useStudentsStore";

const Students = () => {
  const { students } = useStudentsStore();

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
        <div className="flex justify-end items-center gap-4">
          <ButtonLink icon={"plus"} href={"/dashboard/students/create"}>
            Agregar
          </ButtonLink>
          <ButtonLink icon={"upload"} href={"/dashboard/students/bulk-upload"}>
            Cargar masiva
          </ButtonLink>
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">
        <DataTable type={"students"} list={students} />
      </div>
    </div>
  );
};

export default Students;
