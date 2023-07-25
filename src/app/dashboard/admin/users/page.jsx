"use client";
import { useAuthContext } from "@/context/AuthContext";
import DataTable from "@/components/Table/DataTable";
import ButtonLink from "@/components/ButtonLink";

const getDataUsers = async (schoolId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/users?pageIndex=0&pageSize=10&schoolId=${schoolId}`,
    );
    if (!response.ok) return { error: response.statusText };
    const data = await response.json();
    return data;
  } catch (error) {
    return { error };
  }
};

export default async function Page() {
  const { profile } = useAuthContext();

  const isAdmin =
    profile?.roles?.includes("admin-rutes") ||
    profile?.roles?.includes("admin");

  const dataUsers = await getDataUsers(profile?.schoolId);

  return (
    <>
      <div className="grid grid-cols-2">
        <h1 className="font-bold text-3xl">Usuarios</h1>
        <div className="grid-start-2 me-5">
          <div className="flex justify-end gap-2">
            {isAdmin && (
              <ButtonLink href="/dashboard/admin/users/create">
                Crear
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">
        <DataTable type={"users"} list={dataUsers} />
      </div>
    </>
  );
}
