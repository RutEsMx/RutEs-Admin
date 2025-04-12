"use client";
import DataTable from "@/components/Table/DataTable";
import ButtonLink from "@/components/ButtonLink";
import { getSchools } from "@/services/SchoolServices";
import { useState, useEffect } from "react";

export default function Page() {
  const [dataSchools, setDataSchools] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSchools();
      setDataSchools(response);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-2">
        <div>
          <h1 className="font-bold text-3xl">Escuelas</h1>
        </div>
        <div className="grid-start-2 me-5">
          <div className="flex justify-end gap-2">
            <ButtonLink href="/dashboard/admin/schools/create">
              Crear
            </ButtonLink>
          </div>
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">
        <DataTable type={"schools"} list={dataSchools} />
      </div>
    </>
  );
}
