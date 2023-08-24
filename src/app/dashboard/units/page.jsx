"use client";
import ButtonLink from "@/components/ButtonLink";
import LogoLayout from "@/components/LogoLayout";
import DataTable from "@/components/Table/DataTable";

const Units = () => {
  return (
    <div className="container mx-auto px-4 pb-12 h-screen pt-10">
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
        <div className="flex justify-end items-center gap-4">
          <ButtonLink icon={"plus"} href={"/dashboard/units/create"}>
            Agregar
          </ButtonLink>
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">
        <DataTable type={"units"} />
      </div>
    </div>
  );
};

export default Units;
