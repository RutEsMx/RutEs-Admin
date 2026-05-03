"use client";
import FormUnits from "@/components/MultiStepForm/Units";
import { getUnit } from "@/services/UnitsServices";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const [unit, setUnit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchUnit = async () => {
      try {
        const data = await getUnit(id);
        setUnit(data);
      } catch (error) {
        setUnit({ error });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnit();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 h-screen bg-white py-8 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 h-screen bg-white py-8">
      <div className="grid grid-cols-1 gap-4 p-2">
        {unit?.error ? (
          <div className="flex flex-col justify-center items-center h-full mt-4">
            <p className="h-full mx-auto text-2xl">Unidad no encontrada</p>
            <div className="bg-primary rounded px-4 py-1 mt-6">
              <Link href="/dashboard/units">
                <p className="h-full mx-auto text-white text-2xl">Regresar</p>
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
