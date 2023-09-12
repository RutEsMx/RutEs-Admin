"use client";
import LogoLayout from "@/components/LogoLayout";
import { getAllAuxiliars } from "@/services/AuxiliarsServices";
import { getAllDrivers } from "@/services/DriverServices";
import { getAllStudents } from "@/services/StudentsServices";
import { useEffect } from "react";

const getAllData = async () => {
  try {
    await Promise.all([
      getAllDrivers({ all: true }),
      getAllAuxiliars({ all: true }),
      getAllStudents({ all: true }),
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
