"use client";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoutesStore } from "@/store/useRoutesStore";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "@/firebase/client";

const DashboardLayout = ({ children, ...props }) => {
  const { user, loading, school } = useAuthContext();
  const { setRoutes } = useRoutesStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      return router.push("/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!school) return;
    const q = query(
      collection(db, "routes"),
      where("schoolId", "==", school?.id),
      where("isDeleted", "==", false),
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const routes = [];
      querySnapshot.forEach((doc) => {
        routes.push({ ...doc.data(), id: doc.id });
      });
      setRoutes(routes);
    });

    return () => {
      unsubscribe();
    };
  }, [school]);

  return (
    <>
      <NavBar />
      <Sidebar>
        {children}
        {props.dialog}
      </Sidebar>
    </>
  );
};

export default DashboardLayout;
