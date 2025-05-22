"use client";

import NavBar from "@/components/NavBar";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { query, collection, where, getDocs } from "firebase/firestore";
import { useRoutesStore } from "@/store/useRoutesStore";
import { db } from "@/firebase/client";

const DashboardLayout = ({ children }) => {
  const { user, loading, profile, school } = useAuthContext();
  const router = useRouter();
  const { setRoutes } = useRoutesStore();

  const isAdmin =
    profile?.roles?.includes("admin") ||
    profile?.roles?.includes("admin-rutes");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    } else if (profile && !isAdmin) {
      router.push("/dashboard/routes");
    }
  }, [user, loading, router, profile]);

  useEffect(() => {
    if (!school) return;

    const q = query(
      collection(db, "routes"),
      where("schoolId", "==", school?.id),
      where("isDeleted", "==", false),
    );

    getDocs(q).then((querySnapshot) => {
      const routes = [];
      querySnapshot.forEach((doc) => {
        routes.push({ ...doc.data(), id: doc.id });
      });
      setRoutes(routes);
    });
  }, [school, setRoutes]);

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
