"use client";
import FormDriver from "@/components/MultiStepForm/Driver";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const [driver, setDriver] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDriver = async () => {
      try {
        const response = await fetch(`/api/drivers/${id}/`, {
          cache: "no-store",
        });
        if (!response.ok) {
          setDriver({ error: true });
        } else {
          const data = await response.json();
          data.id = id;
          setDriver(data);
        }
      } catch (error) {
        setDriver({ error });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDriver();
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
        {driver?.error ? (
          <div className="flex flex-col justify-center items-center h-full mt-4">
            <p className="h-full mx-auto text-2xl">Conductor no encontrado</p>
            <div className="bg-primary rounded px-4 py-1 mt-6">
              <Link href="/dashboard/drivers">
                <p className="h-full mx-auto text-white text-2xl">Regresar</p>
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
