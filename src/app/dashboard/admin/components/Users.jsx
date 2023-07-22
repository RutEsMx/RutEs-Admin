import { useAuthContext } from "@/context/AuthContext";
import DataTable from "@/components/Table/DataTable";
import ButtonLink from "@/components/ButtonLink";

export default function Users() {
  const { profile } = useAuthContext();

  const isAdmin =
    profile?.roles?.includes("admin-rutes") ||
    profile?.roles?.includes("admin");

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
        <DataTable type={"users"} />
      </div>
    </>
  );
}
