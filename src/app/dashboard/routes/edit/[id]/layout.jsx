"use client";
import { useEffect } from "react";
import LogoLayout from "@/components/LogoLayout";
import { getAllStudents } from "@/services/StudentsServices";

const getAllData = async () => {
  try {
    await Promise.all([getAllStudents({ all: true })]);
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
