// Create route card component

import Link from "next/link";

const RouteCard = ({ route }) => {
  const { name, distance, time } = route;
  return (
    <Link href={`/routes/${route.id}`}>
      <div className="max-w-sm rounded overflow-hidden shadow-lg">
        {/* <img src={image} alt={name} /> */}
        <div className="px-6 py-4">
          <h3>{name}</h3>
          <p>Distance: {distance} miles</p>
          <p>Time: {time} minutes</p>
        </div>
      </div>
    </Link>
  );
};

export default RouteCard;
