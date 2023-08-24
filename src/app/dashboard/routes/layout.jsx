"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { removeCookies } from "@/services/CookiesServices";
import { getAllAuxiliars } from "@/services/AuxiliarsServices";
import { getAllUnits } from "@/services/UnitsServices";
import { getAllDrivers } from "@/services/DriverServices";
import { getAllStudents } from "@/services/StudentsServices";
import { setAlert } from "@/store/useSystemStore";

export default function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const [units, drivers, auxiliars, students] = await Promise.all([
          getAllUnits({ all: true }),
          getAllDrivers({ all: true }),
          getAllAuxiliars({ all: true }),
          getAllStudents({ all: true }),
        ]);
        if (auxiliars?.error || units?.error || drivers?.error || students?.error) {
          removeCookies();
          setAlert({
            type: "error",
            message: auxiliars?.message || units?.message || drivers?.message || students?.message
          })
          return router.push(
            auxiliars?.redirect || units?.redirect || drivers?.redirect || students?.redirect
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
