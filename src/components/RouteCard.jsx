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
import { getNotificationsByRoute } from "@/services/NotificationsServices";
import { useState } from "react";

const RouteCard = ({ route }) => {
  const { name, status } = route;
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await getNotificationsByRoute({
          schoolId: route?.schoolId,
          routeId: route?.id,
          limit: 3,
        });
        setNotifications(response?.data?.list);
      } catch (error) {
        return { error };
      }
    };
    getNotifications();
  }, []);

  const statusColor = COLORS[status];
  const statusName = STATUS_TRAVEL[status] || "Sin estado";

  return (
    <div className="grid col-span-2 lg:col-span-1 grid-rows-3 grid-flow-col  overflow-hidden shadow-l border-2 rounded-lg border-yellow p-3 max-h-56">
      <Link href={`routes/${route.id}`}>
        <div className="flex flex-col justify-center items-center cursor-pointer">
          <h2 className="text-xl font-bold">{name}</h2>
          <span className={`${statusColor}`}>{statusName}</span>
        </div>
      </Link>
      <div className="h-full">
        <NotificationList data={notifications} className={"h-32"} />
      </div>
    </div>
  );
};

export default RouteCard;
