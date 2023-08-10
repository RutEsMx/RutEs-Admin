"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { removeCookies } from "@/services/CookiesServices";
import { getAllAuxiliars } from "@/services/AuxiliarsServices";
import { getAllUnits } from "@/services/UnitsServices";
import { getAllDrivers } from "@/services/DriverServices";

export default function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const [units, drivers, auxiliars] = await Promise.all([
          getAllUnits({ all: true }),
          getAllDrivers({ all: true }),
          getAllAuxiliars({ all: true }),
        ]);
        if (auxiliars?.error || units?.error || drivers?.error) {
          removeCookies();
          return router.push(
            auxiliars?.redirect || units?.redirect || drivers?.redirect,
          );
        }
      } catch (error) {
        removeCookies();
        return router.push("/login");
      }
    };
    getData();
  }, [router]);

  return <>{children}</>;
}
