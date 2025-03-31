"use client";
import NotificationList from "@/components/NotificationsList";
import { db } from "@/firebase/client";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
const { useAuthContext } = require("@/context/AuthContext");

const Notifications = () => {
  const { school } = useAuthContext();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let unsubscribe = () => {};
    if (school?.id) {
      try {
        unsubscribe = onSnapshot(
          query(
            collection(db, "notificationsSchool", school?.id, "notifications"),
            where("category", "!=", "parent"),
            orderBy("category", "desc"),
            orderBy("createdAt", "desc"),
            limit(25),
          ),
          (snapshot) => {
            const data = snapshot.docs.map((doc) => {
              const notify = doc.data();
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

  return (
    <div className="border border-slate-400 rounded-lg">
      <div className="h-20 bg-primary justify-center flex items-center rounded-t-lg gap-4">
        <h1 className="font-bold text-xl">Permisos y Alertas</h1>
        {count > 0 && (
          <span class="relative flex h-6 w-6 bottom-4">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-6 w-6 bg-red-500 items-center justify-center ">
              <p className="text-white text-xs">{count}</p>
            </span>
          </span>
        )}
      </div>
      <div>
        <NotificationList data={data} className={"h-full pb-2 px-2"} />
      </div>
    </div>
  );
};

export default Notifications;
