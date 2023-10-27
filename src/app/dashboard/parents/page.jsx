"use client";
import LogoLayout from "@/components/LogoLayout";
import DataTable from "@/components/Table/DataTable";
import { useParentsStore } from "@/store/useParentsStore";

const Parents = () => {
  const { parents } = useParentsStore();
  
  return (
    <div className="container mx-auto px-4 pb-12 h-screen pt-10">
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
      </div>
      <div className="grid grid-rows-1 gap-4">
        <DataTable type={"parents"} list={parents}/>
      </div>
    </div>
  );
};

export default Parents;
