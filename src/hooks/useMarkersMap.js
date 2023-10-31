import { useEffect, useState } from "react";
import { COLORS_HEX } from "@/utils/options";

const useMarkersMap = (params) => {
  const { students, temporalToHome, temporalToSchool, selectedDayEdit, typeTravel } = params;
  const [markers, setMarkers] = useState([]);
  const day = selectedDayEdit;

  const setMarkersFromStudents = (students) => {
    const newMarkers = [];
    if (!students) return;
    if (!students[day]) return;
    students[day][typeTravel].forEach((element) => {
      element.stop?.coords[`${typeTravel}`]?.lat && element.stop?.coords[`${typeTravel}`]?.lng &&
        newMarkers.push({
          lat: element.stop?.coords[`${typeTravel}`]?.lat,
          lng: element.stop?.coords[`${typeTravel}`]?.lng,
          studentId: element.id,
          name: element.name,
          draggable: false,
          color: COLORS_HEX.rutes,
        });
    });
    setMarkers(newMarkers);
  };

  const setTemporalCoords = (coords, type) => {
    setMarkers((prevMarkers) => {
      const newMarkers = prevMarkers.filter(
        (marker) => marker.studentId !== type
      );
      
      newMarkers.push({
        lat: coords.lat,
        lng: coords.lng,
        studentId: type,
        draggable: true,
        color: COLORS_HEX.rutes,
      });
     
      return newMarkers;
    });
  };

  useEffect(() => {
    setMarkersFromStudents(students);
    if (temporalToHome) setTemporalCoords(temporalToHome, "temporalToHome");
    if (temporalToSchool)
      setTemporalCoords(temporalToSchool, "temporalToSchool");
  }, [students, temporalToHome, temporalToSchool, day, typeTravel]);

  return { markers, setMarkersFromStudents };
};

export default useMarkersMap;
