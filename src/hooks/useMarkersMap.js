import { useEffect, useState } from "react";
import { COLORS_HEX } from "@/utils/options";

const useMarkersMap = (params) => {
  const { students, temporalToHome, temporalToSchool } = params;
  const [markers, setMarkers] = useState([]);
  const day = "monday";

  const setMarkersFromStudents = (students) => {
    const newMarkers = [];
    students?.forEach((student) => {
      student?.stops.length > 0 &&
        student?.stops?.forEach((stop) => {
          if (stop?.day === day) {
            newMarkers.push({
              lat: stop.coords?.toSchool?.lat,
              lng: stop.coords?.toSchool?.lng,
              studentId: student.id,
              name: student.name,
              draggable: false,
              color: COLORS_HEX.rutes,
            });
            newMarkers.push({
              lat: stop.coords?.toHome?.lat,
              lng: stop.coords?.toHome?.lng,
              studentId: student.id,
              name: student.name,
              draggable: false,
              color: COLORS_HEX.rutes,
            });
          }
        });
    });
    setMarkers(newMarkers);
  };

  const setTemporalCoords = (coords, type) => {
    setMarkers((prevMarkers) => {
      const newMarkers = prevMarkers;
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
  }, [students, temporalToHome, temporalToSchool]);

  return { markers, setMarkersFromStudents };
};

export default useMarkersMap;
