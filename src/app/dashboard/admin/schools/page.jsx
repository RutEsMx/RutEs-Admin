import DataTable from "@/components/Table/DataTable";
import ButtonLink from "@/components/ButtonLink";

const getDataSchools = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/schools?pageIndex=0&pageSize=10`,
      { cache: "no-store" },
    );
    if (!response.ok) return { error: response.statusText };
    const data = await response.json();
    return data;
  } catch (error) {
    return { error };
  }
};

export default async function Page() {
  const dataSchools = await getDataSchools();
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
