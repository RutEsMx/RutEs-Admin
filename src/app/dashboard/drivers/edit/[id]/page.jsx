"use client";
import FormDriver from "@/components/MultiStepForm/Driver";
import Link from "next/link";

const getDriver = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/drivers/${id}/`,
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

const Page = async props => {
  const params = await props.params;
  const { id } = params;
  const driver = await getDriver(id);

  return (
    <div className="container mx-auto px-4 h-screen bg-white py-8">
      <div className="grid grid-cols-1 gap-4 p-2">
        {driver?.error ? (
          <div className="flex flex-col justify-center items-center h-full mt-4">
            <p className="h-full mx-auto text-2xl">Conductor no encontrado</p>
            <div className="bg-primary rounded px-4 py-1 mt-6">
              <Link href="/dashboard/drivers">
                <p className="h-full mx-auto text-2xl">Regresar</p>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <FormDriver data={driver} isEdit />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
