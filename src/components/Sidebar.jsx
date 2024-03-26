"use client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = ({ className }) => {
  const pathname = usePathname();

  const linkClass = (href) =>
    cn(
      "w-full justify-start",
      pathname === href
        ? buttonVariants({ variant: "default" })
        : buttonVariants({ variant: "ghost" }),
    );
  return (
    <div className={cn("pb-12 mt-14", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Link
              href="/dashboard/routes"
              className={linkClass("/dashboard/routes")}
            >
              Rutas
            </Link>
            <Link
              href="/dashboard/parents"
              className={linkClass("/dashboard/parents")}
            >
              Padres
            </Link>
            <Link
              href="/dashboard/students"
              className={linkClass("/dashboard/students")}
            >
              Alumnos
            </Link>
            <Link
              href="/dashboard/auxiliars"
              className={linkClass("/dashboard/auxiliars")}
            >
              Auxiliares
            </Link>
            <Link
              href="/dashboard/drivers"
              className={linkClass("/dashboard/drivers")}
            >
              Conductores
            </Link>
            <Link
              href="/dashboard/units"
              className={linkClass("/dashboard/units")}
            >
              Unidades
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
