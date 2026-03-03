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
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-muted border-r h-full overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </>
  );
};

export default DashboardLayout;
