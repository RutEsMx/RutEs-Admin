"use client";
import ButtonAction from "@/components/ButtonAction";
import NotificationList from "@/components/NotificationsList";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/client";
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  limit,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
// import DataTable from "@/components/Table/DataTable";

const Page = () => {
  const { school } = useAuthContext();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let unsubscribe = () => { };
    if (school?.id) {
      try {
        unsubscribe = onSnapshot(
          query(
            collection(db, "notificationsSchool", school?.id, "notifications"),
            where("category", "!=", "parent"),
            orderBy("category", "desc"),
            orderBy("createdAt", "desc"),
            limit(100),
          ),
          (snapshot) => {
            const data = snapshot.docs.map((doc) => {
              const notify = doc.data();
              if (notify?.category === "parent") return;
              return { id: doc.id, ...notify };
            });
            const dataFilter = data.filter((item) => item);
            // count notification that is not readBySchool
            const countData = dataFilter.filter(
              (item) =>
                !item.readBySchool && item.category === "travelWithFriend",
            ).length;
            setData(dataFilter);
            setCount(countData);
          },
        );
      } catch (error) {
        toast.error("Error al obtener las notificaciones");
      }
    }
    return () => {
      unsubscribe();
    };
  }, [school?.id]);

  const markAllAsRead = async () => {
    setIsLoading(true);
    try {
      data.forEach(async (item) => {
        if (!item.readBySchool) {
          const docRef = doc(
            db,
            "notificationsSchool",
            school?.id,
            "notifications",
            item.id,
          );
          if (!docRef) {
            return;
          }
          await updateDoc(docRef, { readBySchool: true });
        }
      });
      toast.success("Notificaciones marcadas como leídas");
    } catch (error) {
      toast.error("Error al marcar las notificaciones como leídas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-12 h-screen  pt-10">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 mb-2 grid grid-cols-3 items-center">
          <div className="col-span-2 flex flex-row">
            <h1 className="font-bold text-3xl">Permisos y Alertas</h1>
            {count > 0 && (
              <span className="relative flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 items-center justify-center ">
                  <p className="text-white text-xs">{count}</p>
                </span>
              </span>
            )}
          </div>
          <div className="col-span-1 flex justify-end">
            <ButtonAction onClick={markAllAsRead} disabled={isLoading}>
              Marcar todo como leído
            </ButtonAction>
          </div>
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4 border-2 rounded-md">
        <NotificationList data={data} className={"h-full pb-2 px-2"} />
      </div>
    </div>
  );
};

export default Page;
