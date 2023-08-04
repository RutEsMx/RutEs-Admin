"use client";
import LogoLayout from "@/components/LogoLayout";
import DataTable from "@/components/Table/DataTable";
import { useAuthContext } from "@/context/AuthContext";

const getInitialDataParents = async (schoolId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/parents?pageIndex=0&pageSize=10&schoolId=${schoolId}`,
      { cache: "no-store" },
    );
    if (!response.ok) return { error: response.statusText };
    const data = await response.json();
    return data;
  } catch (error) {
    return { error };
  }
};

const Parents = async () => {
  const { profile } = useAuthContext();

  const parents = await getInitialDataParents(profile?.schoolId);

  return (
    <div className="container mx-auto px-4 pb-12 h-full pt-10">
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
      </div>
      <div className="grid grid-rows-1 gap-4">
        <DataTable type={"parents"} list={parents} />
      </div>
    </div>
  );
};

export default Parents;
