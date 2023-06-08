'use client';
import Maps from "@/components/Maps";
import Image from "next/image";

const Rutes = () => {
  return (
    <div className="container mx-auto px-4 h-screen">

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
        <Maps />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span>Notificaciones</span>
        </div>
        <div className="col-span-2">
          <span>Rutas</span>
        </div>
      </div>
    </div>
  );
}

export default Rutes;