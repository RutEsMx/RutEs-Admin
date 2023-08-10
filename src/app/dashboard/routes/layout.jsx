"use client";

import { getAllUnits } from "@/services/UnitsServices";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { removeCookies } from "@/services/CookiesServices";

export default function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const response = await getAllUnits({ all: true });
      console.log("🚀 ~ file: layout.jsx:119 ~ getData ~ response", response);
      if (response?.error) {
        removeCookies();
        return router.push(response?.redirect);
      }
    };
    getData();
  }, [router]);

  return <>{children}</>;
}
