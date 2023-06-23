import LogoLayout from "@/components/LogoLayout";
import AddButton from "./AddButton";
import DataTable from "@/components/Table/DataTable";

const Parents = () => {
  return (
    <div className="container mx-auto px-4 pb-12 h-full">
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
        <div className="flex justify-end items-center gap-4">
          <AddButton />
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">
        <DataTable 
          type={'parents'}
        />
      </div>
    </div>
  );
}

export default Parents;