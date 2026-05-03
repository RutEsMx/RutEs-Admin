"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import FormRoute from "@/components/MultiStepForm/Route";
import Link from "next/link";
import { getRouteById } from "@/services/RoutesServices";

const RouteEditSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex justify-end gap-4 mb-4">
      <div className="h-10 w-24 bg-gray-200 rounded" />
      <div className="h-10 w-24 bg-gray-200 rounded" />
    </div>
    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
      <div className="col-span-3 md:col-span-2 border-2 border-gray rounded-lg p-4 space-y-4">
        <div className="flex gap-2 mb-2">
          <div className="h-8 w-20 bg-gray-200 rounded" />
          <div className="h-8 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-5 w-16 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded w-24" />
        <div className="h-5 w-20 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-5 w-20 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-5 w-24 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
      <div className="col-span-3 border-2 border-gray rounded-lg p-4">
        <div className="h-80 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

const Page = () => {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!id || !mounted) return;
    let cancelled = false;

    const fetchRoute = async () => {
      const data = await getRouteById(id);
      if (!cancelled) {
        setRoute(data);
        setIsLoading(false);
      }
    };

    fetchRoute();
    return () => {
      cancelled = true;
    };
  }, [id, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="container mx-auto px-4 h-screen bg-white py-8">
        <div className="grid grid-cols-1 gap-4 p-2">
          <RouteEditSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 h-screen bg-white py-8">
      <div className="grid grid-cols-1 gap-4 p-2">
        {route?.error ? (
          <div className="flex flex-col justify-center items-center h-full mt-4">
            <p className="h-full mx-auto text-2xl">Ruta no encontrada</p>
            <div className="bg-primary rounded px-4 py-1 mt-6">
              <Link href="/dashboard/routes">
                <p className="h-full mx-auto text-2xl">Regresar</p>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <FormRoute data={route} isEdit />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
