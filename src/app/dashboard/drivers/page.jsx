"use client";
import ButtonLink from "@/components/ButtonLink";
import LogoLayout from "@/components/LogoLayout";
import DataTable from "@/components/Table/DataTable";
import { useAuthContext } from "@/context/AuthContext";

const getInitialDataDrivers = async (schoolId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/drivers?pageIndex=0&pageSize=10&schoolId=${schoolId}`,
      { cache: "no-store" },
    );
    if (!response.ok) return { error: response.statusText };
    const data = await response.json();
    return data;
  } catch (error) {
    return { error };
  }
};

const Drivers = async () => {
  const { profile } = useAuthContext();

  const drivers = await getInitialDataDrivers(profile?.schoolId);

  return (
    <div className="container mx-auto px-4 pb-12 h-screen pt-10">
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
