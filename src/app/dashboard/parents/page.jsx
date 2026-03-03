"use client";
import { useEffect } from "react";
import DataTable from "@/components/Table/DataTable";
import TableShell from "@/components/Table/TableShell";
import ButtonLink from "@/components/ButtonLink";
import { useParentsStore } from "@/store/useParentsStore";
import { getParents } from "@/services/ParentsSevices";
import ParentsLoading from "./loading";

const Parents = () => {
  const { parents, isLoading } = useParentsStore();

  useEffect(() => {
    getParents();
  }, []);

  if (isLoading) {
    return <ParentsLoading />;
  }

  return (
    <TableShell
      rightActions={
        <>
          <ButtonLink icon="plus" href="/dashboard/parents/create">
            Agregar
          </ButtonLink>
        </>
      }
    >
      {parents?.rows?.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No hay registros de padres disponibles.
        </div>
      ) : (
        <DataTable type={"parents"} list={parents} />
      )}
    </TableShell>
  );
};

export default Parents;
