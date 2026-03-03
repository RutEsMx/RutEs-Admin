"use client";
import ButtonLink from "@/components/ButtonLink";
import DataTable from "@/components/Table/DataTable";
import { useDriversStore } from "@/store/useDriversStore";
import TableShell from "@/components/Table/TableShell";

const Drivers = () => {
  const { drivers } = useDriversStore();

  return (
    <TableShell
      rightActions={
        <ButtonLink icon={"plus"} href={"/dashboard/drivers/create"}>
          Agregar
        </ButtonLink>
      }
    >
      <DataTable type={"drivers"} list={drivers} />
    </TableShell>
  );
};

export default Drivers;
