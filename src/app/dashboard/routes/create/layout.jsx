"use client";
import LogoLayout from "@/components/LogoLayout";
import { getAuxiliarsRoutes } from "@/services/AuxiliarsServices";
import { getDriversRoutes } from "@/services/DriverServices";
import { useEffect } from "react";

const getAllData = async () => {
  try {
    await Promise.all([
      getDriversRoutes(),
      getAuxiliarsRoutes()
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
      {children}
    </div>
  );
};

export default Layout;
