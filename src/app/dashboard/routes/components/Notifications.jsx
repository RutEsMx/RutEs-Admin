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
              if (notify?.category === "parent") return;
              return { id: doc.id, ...notify };
            });
            const dataFilter = data.filter((item) => item);
            setData(dataFilter);
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
      <div className="h-20 bg-primary justify-center flex items-center rounded-t-lg ">
        <h1 className=" font-bold text-xl">Permisos y Alertas</h1>
      </div>
      <div>
        <NotificationList data={data} className={"h-full pb-2 px-2"} />
      </div>
    </div>
  );
};

export default Notifications;
