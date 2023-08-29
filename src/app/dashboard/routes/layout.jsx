"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { removeCookies } from "@/services/CookiesServices";
import { getAllAuxiliars } from "@/services/AuxiliarsServices";
import { getAllDrivers } from "@/services/DriverServices";
import { getAllStudents } from "@/services/StudentsServices";
import { setAlert } from "@/store/useSystemStore";

export default function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const [drivers, auxiliars, students] = await Promise.all([
          getAllDrivers({ all: true }),
          getAllAuxiliars({ all: true }),
          getAllStudents({ all: true }),
        ]);
        if (auxiliars?.error || drivers?.error || students?.error) {
          removeCookies();
          setAlert({
            type: "error",
            message:
              auxiliars?.message || drivers?.message || students?.message,
          });
          return router.push(
            auxiliars?.redirect || drivers?.redirect || students?.redirect,
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
