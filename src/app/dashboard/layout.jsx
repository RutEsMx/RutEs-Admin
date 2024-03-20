"use client";
import NavBar from "@/components/NavBar";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

const DashboardLayout = ({ children, ...props }) => {
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
      <div className="grid grid-cols-1 lg:grid-cols-5 h-screen">
        <Sidebar className="hidden lg:block bg-muted-foreground" />
        {children}
      </div>
      {props.dialog}
    </>
  );
};

export default DashboardLayout;
