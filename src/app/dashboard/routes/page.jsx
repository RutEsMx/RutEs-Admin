/* eslint-disable @next/next/no-img-element */
import ButtonLink from "@/components/ButtonLink";
import MainMap from "./components/MainMap";
import RoutesCards from "@/components/RoutesCards";
import { Suspense } from "react";
import Notifications from "./components/Notifications";

const Routes = () => {
  return (
    <div className="container mx-auto px-4 pb-12 h-full pt-10">
      <div className="grid grid-cols-2 gap-4 p-2">
        <div>
          <img src="/rutes_logo.png" alt="Rutes" className="w-36 h-full" />
        </div>
        <div className="flex justify-end items-center gap-4">
          {/* <span>Filtrar rutas</span> */}
          <ButtonLink
            href="/dashboard/routes/create"
            className="bg-primary hover:bg-primary-dark"
          >
            Crear ruta
          </ButtonLink>
        </div>
      </div>
      <div className="grid grid-rows-3 gap-4">
        <div className="row-span-1">
          <Suspense fallback={<div>Cargando...</div>}>
            <MainMap />
          </Suspense>
        </div>
        <div className="row-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <Notifications />
            </div>
            <div className="col-span-2 pt-8">
              <Suspense fallback={<div>Cargando...</div>}>
                <RoutesCards />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routes;
