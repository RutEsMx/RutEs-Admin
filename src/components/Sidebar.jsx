"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ({ children }) => {
  const pathname = usePathname();

  const isActive = (href) => {
    return pathname === href ? "bg-yellow" : "transparent";
  };

  return (
    <div className="flex pt-8">
      <div className="fixed w-60 h-screen py-4 bg-nandor border-r-[1px] flex-col justify-between">
        <div className="flex flex-col items-center p-2">
          <Link
            className={`${isActive("/dashboard/routes")} w-full text-center`}
            href="/dashboard/routes"
          >
            <div className="text-white active:bg-yellow">
              <p className="font-bold">Rutas</p>
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center p-2">
          <Link
            className={`${isActive("/dashboard/parents")} w-full text-center`}
            href="/dashboard/parents"
          >
            <div className="text-white">
              <p className="font-bold">Padres</p>
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center p-2">
          <Link
            className={`${isActive("/dashboard/students")} w-full text-center`}
            href="/dashboard/students"
          >
            <div className="text-white">
              <p className="font-bold">Alumnos</p>
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center p-2">
          <Link
            className={`${isActive("/dashboard/auxiliars")} w-full text-center`}
            href="/dashboard/auxiliars"
          >
            <div className="text-white">
              <p className="font-bold">Auxiliares</p>
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center p-2">
          <Link
            className={`${isActive("/dashboard/drivers")} w-full text-center`}
            href="/dashboard/drivers"
          >
            <div className="text-white">
              <p className="font-bold">Conductores</p>
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center p-2">
          <Link
            className={`${isActive("/dashboard/units")} w-full text-center`}
            href="/dashboard/units"
          >
            <div className="text-white">
              <p className="font-bold">Unidades</p>
            </div>
          </Link>
        </div>
      </div>
      <main className="ml-60 w-full bg-white text-black">{children}</main>
    </div>
  );
};

export default Sidebar;
