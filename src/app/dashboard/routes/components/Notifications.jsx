"use client";
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
    <div>
      <h1>Notificationes</h1>
      <div>
        {data?.map(({ id, notification }) => (
          <div key={id}>
            <h3>{notification?.title}</h3>
            <p>{notification?.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
