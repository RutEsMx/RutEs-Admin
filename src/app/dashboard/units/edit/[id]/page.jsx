"use client";
import FormUnits from "@/components/MultiStepForm/Units";
import Link from "next/link";

const getUnit = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/units/${id}/`,
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
  const unit = await getUnit(id);

  return (
    <div className="container mx-auto px-4 h-screen bg-white py-8">
      <div className="grid grid-cols-1 gap-4 p-2">
        {unit?.error ? (
          <div className="flex flex-col justify-center items-center h-full mt-4">
            <p className="h-full mx-auto text-2xl">Unida no encontrada</p>
            <div className="bg-yellow rounded px-4 py-1 mt-6">
              <Link href="/dashboard/units">
                <p className="h-full mx-auto text-2xl">Regresar</p>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className=" text-2xl font-bold">Editar Unidad</p>
            <FormUnits data={unit} isEdit />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
