import { useRouter } from "next/navigation";
import ButtonStep from "@/components/Button";
import { useAuthContext } from "@/context/AuthContext";

export default function Users() {
  const navigation = useRouter()
  const { profile } = useAuthContext()

  const isAdmin = profile?.roles?.includes('admin-rutes') || profile?.roles?.includes('admin')

  return (
    <>
      <div className="grid grid-cols-2">
        <div>
          <h1 className="font-bold text-3xl">Usuarios</h1>
          
        </div>
        <div className=" grid-start-2 me-5">
            { isAdmin && (
                <div className="flex justify-end gap-2">
                  <ButtonStep
                    color="bg-light-gray"
                    onClick={() => navigation.push('/dashboard/admin/users/edit/1')}
                  >
                    Editar
                  </ButtonStep>
                  <ButtonStep
                    color="bg-yellow"
                    onClick={() => navigation.push('/dashboard/admin/users/create')}
                  >
                    Crear
                  </ButtonStep>
                </div>
              )
            }
          </div>
        </div>
      <div className="w-full">
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Correo</th>
              <th className="px-4 py-2">Rol</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Usuario 1</td>
              <td className="border px-4 py-2">
                <a href={`mailto:`} className="text-blue-500">
                  Correo
                </a>
              </td>
              <td className="border px-4 py-2">Administrador</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Usuario 2</td>
              <td className="border px-4 py-2">
                <a href={`mailto:`} className="text-blue-500">
                  Correo 2
                </a>
              </td>
              <td className="border px-4 py-2">Administrador</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Usuario 3</td>
              <td className="border px-4 py-2">
                <a href={`mailto:`} className="text-blue-500">
                  Correo 3
                </a>
              </td>
              <td className="border px-4 py-2">Usuario</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}