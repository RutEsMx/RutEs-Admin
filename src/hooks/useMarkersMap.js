import { useEffect, useState } from "react";
import { COLORS_HEX } from "@/utils/options";

const useMarkersMap = (params) => {
  const {
    students,
    temporalToHome,
    temporalToSchool,
    selectedDayEdit,
    typeTravel,
  } = params;
  const [markers, setMarkers] = useState([]);
  const day = selectedDayEdit;

  const setMarkersFromStudents = (students) => {
    const newMarkers = [];
    if (!students) return;
    if (!students[day]) return;
    students[day][typeTravel].forEach((element) => {
      element?.stop?.coords?.lat &&
        element.stop?.coords?.lng &&
        newMarkers.push({
          lat: element.stop?.coords?.lat,
          lng: element.stop?.coords?.lng,
          studentId: element.id,
          name: element.name,
          draggable: false,
          color: COLORS_HEX.rutes,
        });
    });
    setMarkers([...newMarkers]);
  };

  const setTemporalCoords = (coords, type) => {
    setMarkers((prevMarkers) => {
      const newMarkers = [];
      const temporalMarker = prevMarkers.find((marker) =>
        marker?.studentId?.includes("temporal"),
      );

      newMarkers.push({
        lat: coords?.lat,
        lng: coords?.lng,
        studentId: type,
        name: coords?.label,
        draggable: true,
        color: COLORS_HEX.inactive,
      });

      temporalMarker && newMarkers.push(temporalMarker);
      return newMarkers;
    });
  };

  useEffect(() => {
    if (temporalToHome) setTemporalCoords(temporalToHome, "temporalToHome");
    if (temporalToSchool)
      setTemporalCoords(temporalToSchool, "temporalToSchool");
    if (!temporalToHome && !temporalToSchool) setMarkersFromStudents(students);
  }, [students, temporalToHome, temporalToSchool, day, typeTravel]);

  return { markers, setMarkersFromStudents };
};

export default useMarkersMap;
