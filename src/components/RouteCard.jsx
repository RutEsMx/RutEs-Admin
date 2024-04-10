// Create route card component
// The route card show notifications list with last 3 notifications
// The route card is used in routes page
// The route card has a link to the route page
// The route card has name, status and notifications list
// the notifications list show time, title, description
// The notifications list show a "ver mas"
"use client";

import { COLORS, STATUS_TRAVEL } from "@/utils/options";
import Link from "next/link";
import NotificationList from "./NotificationsList";
import { useEffect } from "react";
import { useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  where,
  query,
  limit,
} from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/firebase/client";

const RouteCard = ({ route }) => {
  const { name, status } = route;
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onSnapshot(
        query(
          collection(
            db,
            "notificationsSchool",
            route?.schoolId,
            "notifications",
          ),
          where("routeId", "==", route?.id),
          orderBy("createdAt", "desc"),
          limit(5),
        ),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });
          setNotifications(data);
        },
      );
    } catch (error) {
      console.log("🚀 ~ useEffect ~ error:", error);
      toast.error("Error al obtener las notificaciones");
    }
    return () => {
      unsubscribe();
    };
  }, []);

  const statusColor = COLORS[status];
  const statusName = STATUS_TRAVEL[status] || "Sin estado";

  return (
    <div className="grid col-span-2 lg:col-span-1 grid-row-5 overflow-hidden shadow-l border-2 rounded-lg border-yellow-500 p-3 max-h-72 md:max-h-64">
      <div className="row-span-1">
        <Link href={`routes/${route.id}`}>
          <div className="flex flex-col justify-center items-center cursor-pointer border-b-2 border-yellow-500">
            <h2 className="text-xl font-bold">{name}</h2>
            <span className={`${statusColor}`}>{statusName}</span>
          </div>
        </Link>
      </div>
      <div className="row-span-2">
        <NotificationList data={notifications} className={"h-32"} />
      </div>
      <div className="row-span-1">
        <Link href={`notifications/${route.id}`}>
          <div className="flex justify-center items-center cursor-pointer border-t-2 border-yellow-500">
            <span className="text-yellow-500">Ver más</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RouteCard;
