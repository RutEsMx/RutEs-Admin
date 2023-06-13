'use client'
import Maps from "@/components/Maps";
import RoutesCards from "@/components/RoutesCards";
import Image from "next/image";
import { useRoutesStore } from "@/store/routesStore";
import { useEffect, useState } from "react";

const Rutes = () => {
  const { routes, setRoutes } = useRoutesStore()
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    const data = routes.map(route => {
      return {
        id: route.id,
        lat: route.tracking.lat,
        lng: route.tracking.lng,
        name: route.name
      }
    })
    setMarkers(data)
  }, [routes])
  
  
  
  return (
    <div className="container mx-auto px-4 pb-12 h-full">
      <div className="grid grid-cols-2 gap-4 p-2">
        <div>
          <Image
            src="/rutes_logo.png"
            alt="Rutes"
            width={150}
            height={70}
            priority
          />
        </div>
        <div className="flex justify-end items-center gap-4">
          <span>Filtrar rutas</span>
          <button className="bg-yellow text-white px-4 py-2 rounded-md">Nueva ruta</button>
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">
        <Maps markers={markers}/>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span>Notificaciones</span>
        </div>
        <div className="col-span-2 pt-8">
          <RoutesCards />
        </div>
      </div>
    </div>
  );
}

export default Rutes;