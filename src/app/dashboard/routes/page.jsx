"use client";

/* eslint-disable @next/next/no-img-element */
import ButtonLink from "@/components/ButtonLink";
import MainMap from "./components/MainMap";
import RoutesCards from "@/components/RoutesCards";
import { Suspense } from "react";
import Notifications from "./components/Notifications";
import LogoLayout from "@/components/LogoLayout";
import RoutesLoading from "./loading";

const Routes = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
        <div className="flex justify-end items-center gap-4">
          <ButtonLink
            href="/dashboard/routes/create"
            className="bg-primary hover:bg-primary-hover"
          >
            Crear ruta
          </ButtonLink>
        </div>
      </div>
      <div className="grid grid-flow-row gap-4">
        <div className="row-span-1">
          <Suspense fallback={<RoutesLoading />}>
            <MainMap />
          </Suspense>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 hidden md:grid">
              <Notifications />
            </div>
            <div className="col-span-2 md:pt-8">
              <Suspense fallback={<RoutesLoading />}>
                <RoutesCards />
              </Suspense>
            </div>
            <div className="col-span-1 grid md:hidden mb-4">
              <Notifications />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Routes;
