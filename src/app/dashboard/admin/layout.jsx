"use client";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const { profile } = useAuthContext();
  const pathname = usePathname();

  const isAdminRutes = profile?.roles?.includes("admin-rutes");

  useEffect(() => {
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      const path = pathname.split("/")[3];
      if (link.id === path) {
        link.classList.add("bg-slate-500");
      } else {
        link.classList.remove("bg-slate-500");
      }
    });
  }, [pathname]);

  return (
    <div className="col-span-3 lg:col-span-4 mx-8">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 gap-4 p-2">
          <div>
            <h1 className="font-bold">Administrador</h1>
          </div>
          <div className="col-span-2 border border-gray rounded-md min-h-[200px]">
            <div className="grid grid-cols-5 gap-4 p-2">
              <div className="space-y-1 flex justify-start flex-col">
                <Button variant="secondary" className="w-full" asChild>
                  <Link
                    id="school"
                    href="/dashboard/admin/school"
                    className="font-bold p-2 text-center rounded-t-2xl"
                  >
                    Escuela
                  </Link>
                </Button>
                <Button variant="secondary" className="w-full" asChild>
                  <Link
                    id="users"
                    href="/dashboard/admin/users"
                    className="font-bold p-2 text-center"
                  >
                    Usuarios
                  </Link>
                </Button>
                {isAdminRutes && (
                  <Button variant="secondary" className="w-full" asChild>
                    <Link
                      id="schools"
                      href="/dashboard/admin/schools"
                      className="font-bold p-2 text-center"
                    >
                      Escuelas
                    </Link>
                  </Button>
                )}
              </div>
              <div className="col-span-4">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
