"use client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export const Sidebar = ({ className }) => {
  const { profile } = useAuthContext();
  const pathname = usePathname();

  const linkClass = (href) =>
    cn(
      "w-full justify-start",
      pathname.includes(href)
        ? buttonVariants({ variant: "default" })
        : buttonVariants({ variant: "ghost" }),
    );

  const isAdmin =
    profile?.roles?.includes("admin") ||
    profile?.roles?.includes("admin-rutes");
  return (
    <div className={cn("py-4 h-full", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Link
              href="/dashboard/routes"
              className={linkClass("/dashboard/routes")}
            >
              Rutas
            </Link>
            {isAdmin && (
              <>
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
                <Link
                  href="/dashboard/notifications"
                  className={linkClass("/dashboard/notifications")}
                >
                  Permisos y Alertas
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
