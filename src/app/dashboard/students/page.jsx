"use client";
import LogoLayout from "@/components/LogoLayout";
import AddButton from "./AddButton";
import DataTable from "@/components/Table/DataTable";
import { useAuthContext } from "@/context/AuthContext";

const getInitialDataStudents = async (schoolId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/students?pageIndex=0&pageSize=10&schoolId=${schoolId}`,
      { cache: "no-store" },
    );
    if (!response.ok) return { error: response.statusText };
    const data = await response.json();
    return data;
  } catch (error) {
    return { error };
  }
};

const Students = async () => {
  const { profile } = useAuthContext();

  const students = await getInitialDataStudents(profile?.schoolId);

  return (
    <div className="container mx-auto px-4 pb-12 h-full">
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
        <div className="flex justify-end items-center gap-4">
          <AddButton />
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">
        <DataTable type={"students"} list={students} />
      </div>
    </div>
  );
};

export default Students;
