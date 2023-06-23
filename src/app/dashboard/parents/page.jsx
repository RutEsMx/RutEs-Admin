import LogoLayout from "@/components/LogoLayout";
import AddButton from "./AddButton";
import Image from "next/image";
import DataTableParents from "@/components/Table/DataTableParents";

async function getAllUsers() {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}dashboard/parents/api/`, { next: { cache: "no-store" }})
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}dashboard/parents/api/`)
  const data = await res.json()
  return data
}
  

const Parents = async () => {
   
  return (
    <div className="container mx-auto px-4 pb-12 h-full">
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
        <div className="flex justify-end items-center gap-4">
          <AddButton />
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">
        <DataTableParents />
      </div>
    </div>
  );
}

export default Parents;