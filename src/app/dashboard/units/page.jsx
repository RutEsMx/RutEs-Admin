"use client";
import ButtonLink from "@/components/ButtonLink";
import LogoLayout from "@/components/LogoLayout";
import DataTable from "@/components/Table/DataTable";
import { useAuthContext } from "@/context/AuthContext";

const getInitialDataUnits = async (schoolId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/units?pageIndex=0&pageSize=10&schoolId=${schoolId}`,
      { cache: "no-store" },
    );
    if (!response.ok) return { error: response.statusText };
    const data = await response.json();
    return data;
  } catch (error) {
    return { error };
  }
};

const Units = async () => {
  const { profile } = useAuthContext();

  const units = await getInitialDataUnits(profile?.schoolId);

  return (
    <div className="container mx-auto px-4 pb-12 h-full pt-10">
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
        <div className="flex justify-end items-center gap-4">
          <ButtonLink icon={"plus"} href={"/dashboard/units/create"}>
            Agregar
          </ButtonLink>
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">
        <DataTable type={"units"} list={units} />
      </div>
    </div>
  );
};

export default Units;
