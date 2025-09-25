"use client";
import { useEffect } from "react";
import LogoLayout from "@/components/LogoLayout";
import DataTable from "@/components/Table/DataTable";
import { useParentsStore } from "@/store/useParentsStore";
import { getParents } from "@/services/ParentsSevices";

const Parents = () => {
  const { parents, isLoading } = useParentsStore();

  useEffect(() => {
    getParents();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 mt-8">
        Cargando datos de padres...
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-8">
      <LogoLayout />
      <div className="grid grid-rows-1 gap-4">
        {parents?.rows?.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No hay registros de padres disponibles.
          </div>
        ) : (
          <DataTable type={"parents"} list={parents} />
        )}
      </div>
    </div>
  );
};

export default Parents;
