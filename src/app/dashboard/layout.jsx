"use client";

import NavBar from "@/components/NavBar";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { subscribeRoutes } from "@/services/RoutesServices";
import { subscribeStudents } from "@/services/StudentsServices";
import { useEffect } from "react";

const DashboardLayout = ({ children }) => {
  const { user, loading, profile, school } = useAuthContext();
  const router = useRouter();

  const isAdmin =
    profile?.roles?.includes("admin") ||
    profile?.roles?.includes("admin-rutes");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    } else if (profile && !isAdmin) {
      router.push("/dashboard/routes");
    }
  }, [user, loading, router, profile, isAdmin]);

  useEffect(() => {
    if (!school?.id) return;

    const unsubRoutes = subscribeRoutes(school.id);
    const unsubStudents = subscribeStudents(school.id);

    return () => {
      unsubRoutes();
      unsubStudents();
    };
  }, [school?.id]);

  return (
    <>
      <NavBar />
      <div className="grid grid-cols-1 lg:grid-cols-5 h-screen">
        {/* Sticky Sidebar */}
        <div className="hidden lg:block col-span-1 bg-muted-foreground sticky top-0 h-screen overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="col-span-4 overflow-y-auto p-4">{children}</main>
      </div>
    </>
  );
};

export default DashboardLayout;
