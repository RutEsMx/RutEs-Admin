"use client";
import { useEffect } from "react";
import LogoLayout from "@/components/LogoLayout";
import DataTable from "@/components/Table/DataTable";
import { useParentsStore } from "@/store/useParentsStore";
import { getParents } from "@/services/ParentsSevices";

const Parents = () => {
  const { parents, isLoading, setLoading } = useParentsStore();

  useEffect(() => {
    setLoading(true);
    getParents().finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <LogoLayout />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
        {!isLoading && parents?.rows?.length > 0 && (
          <DataTable type="parents" list={parents} />
        )}
        {!isLoading && parents?.rows?.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No hay registros de padres disponibles.
          </div>
        )}
      </div>
    </div>
  );
};

export default Parents;
