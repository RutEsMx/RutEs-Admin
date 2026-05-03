"use client";
import FormAuxiliar from "@/components/MultiStepForm/Auxiliar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const [auxiliar, setAuxiliar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchAuxiliar = async () => {
      try {
        const response = await fetch(`/api/auxiliars/${id}/`, {
          cache: "no-store",
        });
        if (!response.ok) {
          setAuxiliar({ error: true });
        } else {
          const data = await response.json();
          data.id = id;
          setAuxiliar(data);
        }
      } catch (error) {
        setAuxiliar({ error });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuxiliar();
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
        {auxiliar?.error ? (
          <div className="flex flex-col justify-center items-center h-full mt-4">
            <p className="h-full mx-auto text-2xl">Auxiliar no encontrado</p>
            <div className="bg-primary rounded px-4 py-1 mt-6">
              <Link href="/dashboard/auxiliars">
                <p className="h-full mx-auto text-white text-2xl">Regresar</p>
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
