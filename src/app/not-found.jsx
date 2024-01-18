import ButtonLink from "@/components/ButtonLink";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="mx-auto bg-white text-gray h-screen">
      <div className="grid grid-cols-2 h-full">
        <div className="grid-span-1">
          <div className="flex justify-end items-center h-full me-10">
            <Image src="/error_logo.png" alt="error" width={150} height={150} />
          </div>
        </div>
        <div className="grid-span-1">
          <div className="flex flex-col justify-center h-full leading-8">
            <span className="font-bold text-[60px] m-0">404</span>
            <span className="text-2xl font-thin mb-6">
              No se encontró el sitio
            </span>
            <ButtonLink href="/dashboard/routes" className={"text-black"}>
              Ir a inicio
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
