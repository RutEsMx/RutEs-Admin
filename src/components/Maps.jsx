import { useMemo } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const Maps = ({ markers }) => {
  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(
    () => ({ lat: 19.432902439607627, lng: -99.13365305513578 }),
    [],
  );

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    [],
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_API_KEY,
    libraries: libraries,
  });

  return (
    <div className="bg-gray lg:h-[500px] sm:h-[250px]">
      {!isLoaded ? (
        <p>Loading...</p>
      ) : (
        <GoogleMap
          options={mapOptions}
          zoom={14}
          center={mapCenter}
          // mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ width: "100%", height: "500px" }}
          onLoad={() => console.log("Map Component Loaded...")}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.name}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default Maps;
