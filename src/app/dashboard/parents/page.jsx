"use client";
import LogoLayout from "@/components/LogoLayout";
import DataTable from "@/components/Table/DataTable";
import { useParentsStore } from "@/store/useParentsStore";

const Parents = () => {
  const { parents } = useParentsStore();

  return (
    <div className="container mx-auto">
      <LogoLayout />
      <div className="grid grid-rows-1 gap-4">
        <DataTable type={"parents"} list={parents} />
      </div>
    </div>
  );
};

export default Parents;
