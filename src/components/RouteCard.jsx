// Create route card component
// The route card show notifications list with last 3 notifications
// The route card is used in routes page
// The route card has a link to the route page
// The route card has name, status and notifications list
// the notifications list show time, title, description
// The notifications list show a "ver mas"

import { COLORS, STATUS_TRAVEL } from "@/utils/options";
import Link from "next/link";
import NotificationList from "./NotificationsList";

const RouteCard = ({ route }) => {
  const { name, status, notifications } = route;

  const statusColor = COLORS[status];
  const statusName = STATUS_TRAVEL[status] || "Sin estado";

  return (
    <div className="grid grid-rows-3 grid-flow-col max-w-sm overflow-hidden shadow-l border-2 rounded-lg border-yellow p-3 max-h-56">
      <Link href={`routes/${route.id}`}>
        <div className="flex flex-col justify-center items-center cursor-pointer">
          <h2 className="text-xl font-bold">{name}</h2>
          <span className={`${statusColor}`}>{statusName}</span>
        </div>
      </Link>
      <div className="h-full">
        <NotificationList notifications={notifications} />
      </div>
    </div>
  );
};

export default RouteCard;
