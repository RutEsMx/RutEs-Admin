"use client";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { db } from "@/firebase/client";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

const updateStatus = async (id, schoolId) => {
  try {
    const docRef = doc(
      db,
      "notificationsSchool",
      schoolId,
      "notifications",
      id,
    );
    if (!docRef) {
      return;
    }
    await updateDoc(docRef, { readBySchool: true });
  } catch (error) {
    toast.error(error?.message || "Error al actualizar el estado");
  }
};

const handleClick = async (data, studentRequest, router) => {
  const { category, id, schoolId } = data;
  if (category !== "travelWithFriend") return null;
  await updateStatus(id, schoolId);
  return router.push(`/dashboard/travel/${studentRequest}`);
};

const NotificationItem = ({ data }) => {
  const router = useRouter();
  const { notification, createdAt, category, readBySchool } = data;
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
      className={`
        flex flex-row text-sm py-2 cursor-pointer justify-between 
        ${
          category === "travelWithFriend" && !readBySchool
            ? "bg-blue-400/50"
            : ""
        }
      `}
      onClick={() => handleClick(data, data?.studentRequest, router)}
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
