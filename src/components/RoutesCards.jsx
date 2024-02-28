"use client";
import RouteCard from "@/components/RouteCard";
import { useRoutesStore } from "@/store/useRoutesStore";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "@/firebase/client";
import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";

const RoutesCards = () => {
  const { setRoutes } = useRoutesStore();
  const { school } = useAuthContext();
  const [routesData, setRoutesData] = useState([]);

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
      setRoutesData(routes);
    });

    return () => {
      unsubscribe();
    };
  }, [school, setRoutes]);

  return (
    <div className="grid grid-cols-2 gap-2">
      {routesData?.map((route) => (
        <RouteCard route={route} key={route?.id} />
      ))}
    </div>
  );
};

export default RoutesCards;
