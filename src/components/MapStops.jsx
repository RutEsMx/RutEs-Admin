import { useState } from "react";
import Maps from "./Maps";
import { useRoutesStore } from "@/store/useRoutesStore";

const MapStops = () => {
  const [markers, setMarkers] = useState([]);
  const { stops } = useRoutesStore();
  console.log("🚀 ~ file: MapStops.jsx:8 ~ MapStops ~ stops:", stops)
  

  return (
    <div className="bg-gray lg:h-[500px] sm:h-[250px]">
      <Maps 
        markers={markers} 
        setMarkers={setMarkers}
      />
    </div>
  );
};

export default MapStops;
