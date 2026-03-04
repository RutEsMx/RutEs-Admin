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
      getDriversRoutes(),
      getAuxiliarsRoutes(),
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
    <>
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
      </div>
      {children}
    </>
  );
};

export default Layout;
