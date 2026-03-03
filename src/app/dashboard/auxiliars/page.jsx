"use client";
import ButtonLink from "@/components/ButtonLink";
import DataTable from "@/components/Table/DataTable";
import { useAuxiliarsStore } from "@/store/useAuxiliarsStore";
import TableShell from "@/components/Table/TableShell";

const Auxilars = () => {
  const { auxiliars } = useAuxiliarsStore();

  return (
    <TableShell
      rightActions={
        <ButtonLink icon={"plus"} href={"/dashboard/auxiliars/create"}>
          Agregar
        </ButtonLink>
      }
    >
      <DataTable type={"auxiliars"} list={auxiliars} />
    </TableShell>
  );
};

export default Auxilars;
