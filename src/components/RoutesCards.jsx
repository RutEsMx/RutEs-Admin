import { useEffect } from "react";
import { generateRoutes } from "@/utils/DataFaker";
import RouteCard from "@/components/RouteCard";
import { useRoutesStore } from "@/store/useRoutesStore";

const RoutesCards = () => {
  const { routes, addRoute } = useRoutesStore();

  useEffect(() => {
    const data = generateRoutes();
    addRoute(data);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-5">
      {routes.map((route) => (
        <RouteCard route={route} key={route?.id} />
      ))}
    </div>
  );
};

export default RoutesCards;
