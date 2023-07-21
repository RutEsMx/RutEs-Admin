import { useRouter } from "next/navigation";
import ButtonStep from "@/components/Button";
import { useAuthContext } from "@/context/AuthContext";
import DataTable from "@/components/Table/DataTable";

export default function Users() {
  const navigation = useRouter();
  const { profile } = useAuthContext();

  const isAdmin =
    profile?.roles?.includes("admin-rutes") ||
    profile?.roles?.includes("admin");

  return (
    <>
      <div className="grid grid-cols-2">
        <div>
          <h1 className="font-bold text-3xl">Usuarios</h1>
        </div>
        <div className=" grid-start-2 me-5">
          {isAdmin && (
            <div className="flex justify-end gap-2">
              <ButtonStep
                color="bg-yellow"
                onClick={() => navigation.push("/dashboard/admin/users/create")}
              >
                Crear
              </ButtonStep>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">
        <DataTable type={"users"} />
      </div>
    </>
  );
}
