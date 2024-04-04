"use client";
import { useRouter } from "next/navigation";

const handleClick = (category, studentRequest, router) => {
  if (category !== "travelWithFriend") return null;
  return router.push(`/dashboard/travel/${studentRequest}`);
};

const NotificationItem = ({ data }) => {
  const router = useRouter();
  const { notification, createdAt, category } = data;
  const dateFormat = new Date(createdAt._seconds * 1000).toLocaleTimeString(
    "es-MX",
    { hour: "2-digit", minute: "2-digit" },
  );

  return (
    <div
      className="grid grid-cols-6 text-sm mt-2 pt-2 cursor-pointer"
      onClick={() => handleClick(category, data?.studentRequest, router)}
    >
      <div className="flex justify-center items-center cursor-pointer">
        <label className="cursor-pointer">{dateFormat}</label>
      </div>
      <div className="col-span-5 flex flex-col cursor-pointer">
        <label className="font-bold cursor-pointer">{notification.title}</label>
        <label className="cursor-pointer">{notification.body}</label>
      </div>
    </div>
  );
};

const NotificationList = ({ data, className }) => {
  return (
    <div className={`overflow-auto ${className}`}>
      <div className="divide-y-2 grid grid-cols-1">
        {data?.map((notification) => (
          <NotificationItem data={notification} key={notification?.id} />
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
