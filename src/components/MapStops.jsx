import { useFormikContext } from "formik";
import Maps from "./Maps";
import useMarkersMap from "@/hooks/useMarkersMap";
import { geocodeByLatLng } from "react-google-places-autocomplete";
import { useRoutesStore } from "@/store/useRoutesStore";

const MapStops = () => {
  const { values, setFieldValue } = useFormikContext();
  const { selectedDayEdit, typeTravel } = useRoutesStore();

  const { markers } = useMarkersMap({
    students: values?.students,
    temporalToHome: values?.temporalToHome,
    temporalToSchool: values?.temporalToSchool,
    temporalWorkshop: values?.temporalWorkshop,
    selectedDayEdit,
    typeTravel,
  });

  const setMarkerValue = async (studentId, coords) => {
    const responseGeocode = await geocodeByLatLng(coords);
    delete responseGeocode[0].geometry;

    if (studentId === "temporalToHome") {
      setFieldValue("temporalToHome", {
        label: responseGeocode[0]?.formatted_address,
        ...coords,
        ...responseGeocode[0],
      });
      return;
    }
    if (studentId === "temporalToSchool") {
      setFieldValue("temporalToSchool", {
        label: responseGeocode[0]?.formatted_address,
        ...coords,
        ...responseGeocode[0],
      });
      return;
    }
    if (studentId === "temporalWorkshop") {
      setFieldValue("temporalWorkshop", {
        label: responseGeocode[0]?.formatted_address,
        ...coords,
        ...responseGeocode[0],
      });
      return;
    }
  };

  return (
    <div className="bg-gray md:h-[500px]">
      <Maps markers={markers} setMarker={setMarkerValue} />
    </div>
  );
};

export default MapStops;
