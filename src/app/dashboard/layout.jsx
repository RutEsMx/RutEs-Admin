"use client";
import NavBar from "@/components/NavBar";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

const DashboardLayout = ({ children, ...props }) => {
  const { user, loading, profile } = useAuthContext();
  const router = useRouter();

  const isAdmin =
    profile?.roles?.includes("admin") ||
    profile?.roles?.includes("admin-rutes");

  useEffect(() => {
    if (!loading && !user) {
      return router.push("/signin");
    } else if (!isAdmin) return router.push("/dashboard/routes");
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
