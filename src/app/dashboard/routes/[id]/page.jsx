"use client";
import { useEffect, useState } from "react";
import { COLORS, STATUS_TRAVEL } from "@/utils/options";
import ButtonAction from "@/components/ButtonAction";
import ButtonLink from "@/components/ButtonLink";
import { useRoutesStore } from "@/store/useRoutesStore";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";
import { removeRoutes } from "@/services/RoutesServices";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {
  const { routes } = useRoutesStore();
  const [route, setRoute] = useState({});
  const [color, setColor] = useState("");
  const [statusName, setStatusName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "routes"), where("id", "==", params.id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let route = null;
      querySnapshot.forEach((doc) => {
        route = { ...doc.data(), id: doc.id };
      });
      setColor(COLORS[route?.status]);
      setStatusName(STATUS_TRAVEL[route?.status] || "Sin estado");
      setRoute(route);
    });
    return () => {
      unsubscribe();
    };
  }, [routes, params.id]);

  const handleDelete = async () => {
    const response = await removeRoutes(route);
    if (!response?.success) return;
    return router.replace("/dashboard/routes");
  };

  return (
    <div className="container mx-auto px-4 pb-12 h-screen pt-10">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <h1 className="font-bold text-3xl">Datos de ruta</h1>
        </div>
        <div className="flex justify-end gap-2">
          <ButtonAction color="bg-warning" onClick={handleDelete}>
            Eliminar
          </ButtonAction>
          <ButtonLink
            color="bg-light-gray"
            href={`/dashboard/routes/edit/${params.id}`}
          >
            Editar
          </ButtonLink>
        </div>
      </div>
      <div className="border border-black px-4 py-2 mt-4">
        <div className="grid grid-cols-3">
          <div className="col-span-1">
            <div className="flex flex-col justify-around">
              <div className="flex flex-row gap-2">
                <span className="font-bold">Nombre:</span>
                <span className="">{route?.name}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Capacidad:</span>
                <span className="">{route?.capacity}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Status:</span>
                <span className={`${color}`}>{statusName}</span>
              </div>
            </div>
          </div>
          <div>Mapa</div>
        </div>
      </div>
    </div>
  );
};

export default Page;
