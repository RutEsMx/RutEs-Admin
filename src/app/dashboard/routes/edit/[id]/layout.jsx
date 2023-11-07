"use client";
import LogoLayout from "@/components/LogoLayout";
import { getAuxiliarsRoutes } from "@/services/AuxiliarsServices";
import { getDriversRoutes } from "@/services/DriverServices";
import { getUnitsRoutes } from "@/services/UnitsServices";
import { getStudentsForRoutes } from "@/services/StudentsServices";
import { useEffect } from "react";

const getAllData = async () => {
  try {
    await Promise.all([
      getDriversRoutes(true),
      getAuxiliarsRoutes(true),
      getUnitsRoutes(),
      getStudentsForRoutes(),
    ]);
  } catch (error) {
    return { error: error.message };
  }
};

const Layout = ({ children }) => {
  useEffect(() => {
    getAllData();
  }, []);
  return (
    <div className="container mx-auto px-4 pb-12 h-full pt-10">
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
      </div>
      <div className="grid grid-rows-1 gap-4">{children}</div>
    </div>
  );
};

export default Layout;
