"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ({ children }) => {
  const pathname = usePathname();

  const isActive = (href) => {
    const isSamePath = pathname.includes(href);
    return isSamePath ? "bg-yellow" : "transparent";
  };

  return (
    <div className="flex pt-8">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content ">
          <main className="w-full bg-white text-black">{children}</main>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu sm:pt-20 md:pt-14 lg:pt-8 p-4 w-60  h-full bg-nandor text-xl">
            <div
              className={`${isActive(
                "/dashboard/routes",
              )} flex flex-col items-center p-2 hover:bg-yellow"`}
            >
              <Link className="w-full text-center" href="/dashboard/routes">
                <div className="text-white">
                  <p className="font-bold">Rutas</p>
                </div>
              </Link>
            </div>
            <div
              className={`${isActive(
                "/dashboard/parents",
              )} flex flex-col items-center p-2 hover:bg-yellow"`}
            >
              <Link className="w-full text-center" href="/dashboard/parents">
                <div className="text-white">
                  <p className="font-bold">Padres</p>
                </div>
              </Link>
            </div>
            <div
              className={`${isActive(
                "/dashboard/students",
              )} flex flex-col items-center p-2 hover:bg-yellow"`}
            >
              <Link className="w-full text-center" href="/dashboard/students">
                <div className="text-white">
                  <p className="font-bold">Alumnos</p>
                </div>
              </Link>
            </div>
            <div
              className={`${isActive(
                "/dashboard/auxiliars",
              )} flex flex-col items-center p-2 hover:bg-yellow"`}
            >
              <Link className="w-full text-center" href="/dashboard/auxiliars">
                <div className="text-white">
                  <p className="font-bold">Auxiliares</p>
                </div>
              </Link>
            </div>
            <div
              className={`${isActive(
                "/dashboard/drivers",
              )} flex flex-col items-center p-2 hover:bg-yellow"`}
            >
              <Link className="w-full text-center" href="/dashboard/drivers">
                <div className="text-white">
                  <p className="font-bold">Conductores</p>
                </div>
              </Link>
            </div>
            <div
              className={`${isActive(
                "/dashboard/units",
              )} flex flex-col items-center p-2 hover:bg-yellow"`}
            >
              <Link className="w-full text-center" href="/dashboard/units">
                <div className="text-white">
                  <p className="font-bold">Unidades</p>
                </div>
              </Link>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
