"use client";

import ButtonLink from "@/components/ButtonLink";

export default function Error() {
  return (
    <div className="grid h-screen px-4 bg-white place-content-center">
      <div className="flex text-center flex-col items-center">
        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl pb-8">
          Algo salió mal
        </p>
        <ButtonLink href="/dashboard/admin">Regresar</ButtonLink>
      </div>
    </div>
  );
}
