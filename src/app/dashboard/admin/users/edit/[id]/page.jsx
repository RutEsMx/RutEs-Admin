import FormUser from "@/components/MultiStepForm/Users";
import Link from "next/link";

const getUser = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/api/users/${id}/`,
      { cache: "no-store" },
    );
    if (!response.ok) return { error: true };
    const data = await response.json();
    data.id = id;
    return data;
  } catch (error) {
    return { error };
  }
};

const Page = async ({ params }) => {
  const { id } = params;
  const user = await getUser(id);

  return (
    <div className="container mx-auto px-4 h-screen bg-white">
      <div className="grid grid-cols-1 gap-4 p-2">
        {user?.error ? (
          <div className="flex flex-col justify-center items-center h-full mt-4">
            <p className="h-full mx-auto text-2xl">Usuario no encontrado</p>
            <div className="bg-yellow rounded px-4 py-1 mt-6">
              <Link href="/dashboard/admin">
                <p className="h-full mx-auto text-2xl">Regresar</p>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className=" text-2xl font-bold">Editar Usuario</p>
            <FormUser data={user} isEdit />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
