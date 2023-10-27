"use client";
import LogoLayout from "@/components/LogoLayout";
import ButtonLink from "@/components/ButtonLink";
import DataTable from "@/components/Table/DataTable";
import { useAuxiliarsStore } from "@/store/useAuxiliarsStore";
  
const Auxilars = () => {
  const { auxiliars } = useAuxiliarsStore();

  return (
    <div className="container mx-auto px-4 pb-12 h-screen pt-10">
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
        <div className="flex justify-end items-center gap-4">
          <ButtonLink icon={"plus"} href={"/dashboard/auxiliars/create"}>
            Agregar
          </ButtonLink>
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">
        <DataTable type={"auxiliars"} list={auxiliars} />
      </div>
    </div>
  );
};

export default Auxilars;
