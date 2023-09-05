import { useEffect } from "react";
import RouteCard from "@/components/RouteCard";
import { useRoutesStore } from "@/store/useRoutesStore";
import { db } from "@/firebase/client";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import { useAuthContext } from "@/context/AuthContext";

const RoutesCards = () => {
  const { school } = useAuthContext();

  const { routes, setRoutes } = useRoutesStore();

  useEffect(() => {
    if (!school) return;
    const q = query(
      collection(db, "routes"),
      where("schoolId", "==", school?.id),
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
    <div className="grid grid-cols-2 gap-5">
      {routes?.map((route) => (
        <RouteCard route={route} key={route?.id} />
      ))}
    </div>
  );
};

export default RoutesCards;
