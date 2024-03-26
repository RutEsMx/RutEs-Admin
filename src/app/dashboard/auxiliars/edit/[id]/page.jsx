"use client";
import FormAuxiliar from "@/components/MultiStepForm/Auxiliar";
import Link from "next/link";

const getAuxiliar = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/auxiliars/${id}/`,
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
  const auxiliar = await getAuxiliar(id);

  return (
    <div className="container mx-auto px-4 h-screen bg-white py-8">
      <div className="grid grid-cols-1 gap-4 p-2">
        {auxiliar?.error ? (
          <div className="flex flex-col justify-center items-center h-full mt-4">
            <p className="h-full mx-auto text-2xl">Auxiliar no encontrado</p>
            <div className="bg-primary rounded px-4 py-1 mt-6">
              <Link href="/dashboard/auxiliars">
                <p className="h-full mx-auto text-2xl">Regresar</p>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <FormAuxiliar data={auxiliar} isEdit />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
