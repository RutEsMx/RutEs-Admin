// Create route card component

const RouteCard = ({ route }) => {
  const { name, description, image, distance, time } = route;
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      {/* <img src={image} alt={name} /> */}
      <div className="px-6 py-4">
        <h3>{name}</h3>
        <p>Distance: {distance} miles</p>
        <p>Time: {time} minutes</p>
      </div>
    </div>
  );
}

export default RouteCard;
