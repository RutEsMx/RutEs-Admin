"use client";
import ButtonLink from "@/components/ButtonLink";
import DataTable from "@/components/Table/DataTable";
import { useUnitsStore } from "@/store/useUnitsStore";
import TableShell from "@/components/Table/TableShell";

const Units = () => {
  const { units } = useUnitsStore();

  return (
    <TableShell
      rightActions={
        <ButtonLink icon={"plus"} href={"/dashboard/units/create"}>
          Agregar
        </ButtonLink>
      }
    >
      <DataTable type={"units"} list={units} />
    </TableShell>
  );
};

export default Units;
