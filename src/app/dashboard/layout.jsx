"use client";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      return router.push("/signin");
    }
  }, [user, loading, router]);

  return (
    <>
      <NavBar />
      <Sidebar>{children}</Sidebar>
    </>
  );
};

export default DashboardLayout;
