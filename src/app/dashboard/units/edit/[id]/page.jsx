"use client";
import FormUnits from "@/components/MultiStepForm/Units";
import { getUnit } from "@/services/UnitsServices";
import Link from "next/link";

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
            <FormUnits data={unit} isEdit />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
