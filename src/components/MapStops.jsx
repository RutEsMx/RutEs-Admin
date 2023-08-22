import { useFormikContext } from "formik";
import Maps from "./Maps";
import useMarkersMap from "@/hooks/useMarkersMap";
import { geocodeByLatLng } from "react-google-places-autocomplete";

const MapStops = () => {
  const { values, setFieldValue } = useFormikContext();
  const { markers } = useMarkersMap({
    students: values?.students,
    temporalToHome: values?.temporalToHome,
    temporalToSchool: values?.temporalToSchool,
  });
  // const day = 'monday'

  const setMarkerValue = async (studentId, coords) => {
    const responseGeocode = await geocodeByLatLng(coords);

    if (studentId === "temporalToHome") {
      setFieldValue("temporalToHome", {
        label: responseGeocode[0]?.formatted_address,
        ...coords,
      });
      return;
    }
    if (studentId === "temporalToSchool") {
      setFieldValue("temporalToSchool", {
        label: responseGeocode[0]?.formatted_address,
        ...coords,
      });
      return;
    }
  };

  return (
    <div className="bg-gray lg:h-[500px] sm:h-[250px]">
      <Maps markers={markers} setMarker={setMarkerValue} />
    </div>
  );
};

export default MapStops;
