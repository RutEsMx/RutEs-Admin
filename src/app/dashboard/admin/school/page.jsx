"use client";
import Image from "next/image";
import { useAuthContext } from "@/context/AuthContext";
import ButtonLink from "@/components/ButtonLink";

export default function Page() {
  const { profile, school } = useAuthContext();

  return (
    <>
      <div className="grid grid-cols-2">
        <div>
          <h1 className="font-bold text-3xl">Escuela</h1>
        </div>
        <div className="grid-start-2 me-5">
          <div className="flex justify-end gap-2">
            <ButtonLink
              color="bg-light-gray"
              href={`/dashboard/admin/schools/edit/${profile?.schoolId}`}
            >
              Editar
            </ButtonLink>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3">
        <div className="flex flex-col">
          <label className="font-bold">Nombre:</label>
          <label className="font-bold">Clave:</label>
          <label className="font-bold">Correo:</label>
          <label className="font-bold">Telefono:</label>
          <label className="font-bold">Dirección:</label>
          <label className="font-bold">Código Postal:</label>
        </div>
        <div>
          <p>{school?.name || <br />}</p>
          <p>{school?.clave || <br />}</p>
          <p>
            <a href={`mailto:`} className="text-blue-500">
              {school?.email || <br />}
            </a>
          </p>
          <p>{school?.phone || <br />}</p>
          <p>{school?.address || <br />}</p>
          <p>{school?.postalCode || <br />}</p>
        </div>
        <div>
          <p>Logo: </p>
          <Image src="/logo.png" alt="logo" width={100} height={100} />
        </div>
      </div>
    </>
  );
}
