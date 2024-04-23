"use client";
import { useEffect, useState } from "react";
import { COLORS, STATUS_TRAVEL } from "@/utils/options";
import ButtonLink from "@/components/ButtonLink";
import { useRoutesStore } from "@/store/useRoutesStore";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";
import Maps from "@/components/Maps";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ButtonAction from "@/components/ButtonAction";
import { removeRoutes } from "@/services/RoutesServices";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

  const handleDelete = async (id) => {
    const response = await removeRoutes(id);
    if (!response?.success) {
      toast.error("Error al eliminar la ruta");
      return;
    }
    toast.success("Ruta eliminada correctamente");
    return router.replace("/dashboard/routes");
  };

  return (
    <div className="container mx-auto px-4 pb-12 h-screen pt-10">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <h1 className="font-bold text-3xl">Datos de ruta</h1>
        </div>
        <div className="flex justify-end gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <ButtonAction color="bg-warning">Eliminar</ButtonAction>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  ¿Deseas eliminar la parada todos los dias?
                </DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <ButtonAction color="bg-warning">Cancelar</ButtonAction>
                </DialogClose>
                <ButtonAction
                  color="bg-primary"
                  onClick={() => handleDelete(params.id)}
                >
                  Eliminar
                </ButtonAction>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <ButtonLink color="bg-light-gray" href={`/dashboard/routes/`}>
            Atrás
          </ButtonLink>
          <ButtonLink
            color="bg-primary"
            href={`/dashboard/routes/edit/${params.id}`}
          >
            Editar
          </ButtonLink>
        </div>
      </div>
      <div className="border border-black px-4 py-2 mt-4">
        <div className="grid grid-cols-2">
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
                <span className="font-bold">Estado:</span>
                <span className={`${color}`}>{statusName}</span>
              </div>
            </div>
          </div>
          <div className="bg-gray lg:h-[500px] sm:h-[250px] w-full">
            <Maps markers={[]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
