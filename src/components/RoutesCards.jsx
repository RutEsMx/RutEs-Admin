"use client";
import RouteCard from "@/components/RouteCard";
import { useRoutesStore } from "@/store/useRoutesStore";

const RoutesCards = () => {
  const { routes } = useRoutesStore();

  return (
    <div className="grid grid-cols-2 gap-5">
      {routes?.map((route) => (
        <RouteCard route={route} key={route?.id} />
      ))}
    </div>
  );
};

export default RoutesCards;
