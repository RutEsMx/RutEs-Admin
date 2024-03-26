"use client";
import ButtonLink from "@/components/ButtonLink";
import LogoLayout from "@/components/LogoLayout";
import DataTable from "@/components/Table/DataTable";
import { useDriversStore } from "@/store/useDriversStore";

const Drivers = () => {
  const { drivers } = useDriversStore();

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
        <div className="flex justify-end items-center gap-4">
          <ButtonLink icon={"plus"} href={"/dashboard/drivers/create"}>
            Agregar
          </ButtonLink>
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">
        <DataTable type={"drivers"} list={drivers} />
      </div>
    </div>
  );
};

export default Drivers;
