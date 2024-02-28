"use client";
import NotificationList from "@/components/NotificationsList";
import { getNotifications } from "@/services/NotificationsServices";
import { useEffect } from "react";
import { useState } from "react";
const { useAuthContext } = require("@/context/AuthContext");

const Notifications = async () => {
  const { school } = useAuthContext();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getNotifications(school?.id);
        if (!data) {
          setError("No data");
        } else {
          setData(data?.list);
        }
      } catch (error) {
        setError(error);
      }
    };

    getData();
  }, [school?.id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="border border-slate-400 rounded-lg">
      <div className="h-20 bg-yellow justify-center flex items-center rounded-t-lg ">
        <h1 className=" font-bold text-xl">Notificaciones</h1>
      </div>
      <div>
        <NotificationList data={data} className={"h-full p-2"} />
      </div>
    </div>
  );
};

export default Notifications;
