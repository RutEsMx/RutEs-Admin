"use client";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";

const handleClick = (category, studentRequest, router) => {
  if (category !== "travelWithFriend") return null;
  return router.push(`/dashboard/travel/${studentRequest}`);
};

const NotificationItem = ({ data }) => {
  const router = useRouter();
  const { notification, createdAt, category } = data;
  const createdAtDate = createdAt._seconds || createdAt.seconds;
  const dateFormat = new Date(createdAtDate * 1000).toLocaleTimeString(
    "es-MX",
    {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div
      className="flex flex-row text-sm mt-2 pt-2 cursor-pointer justify-between"
      onClick={() => handleClick(category, data?.studentRequest, router)}
    >
      <div className=" w-2/6 flex justify-center items-center cursor-pointer">
        <Label className="cursor-pointer text-xs">{dateFormat}</Label>
      </div>
      <div className=" w-4/6 flex flex-col cursor-pointer">
        <Label className="font-bold cursor-pointer text-xs">
          {notification.title}
        </Label>
        <Label className="cursor-pointer text-xs">{notification.body}</Label>
      </div>
    </div>
  );
};

export default NotificationItem;
