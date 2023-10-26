import { useEffect, useState } from "react";
import { COLORS_HEX } from "@/utils/options";

const useMarkersMap = (params) => {
  const { students, temporalToHome, temporalToSchool, selectedDayEdit, typeTravel } =
    params;
  const [markers, setMarkers] = useState([]);
  const day = selectedDayEdit;

  const setMarkersFromStudents = (students) => {
    // console.log("🚀 ~ file: useMarkersMap.js:11 ~ setMarkersFromStudents ~ students:", students[day])
    const newMarkers = [];
    // students?.forEach((student) => {
    //   student?.stops?.length > 0 &&
    //     student?.stops?.forEach((stop) => {
    //       if (stop?.day === day) {
    //         if (stop.coords?.toSchool?.lat && stop.coords?.toSchool?.lng) {
    //           newMarkers.push({
    //             lat: stop.coords?.toSchool?.lat,
    //             lng: stop.coords?.toSchool?.lng,
    //             studentId: student.id,
    //             name: student.name,
    //             draggable: false,
    //             color: COLORS_HEX.rutes,
    //           });
    //         }
    //         if (stop.coords?.toHome?.lat && stop.coords?.toHome?.lng) {
    //           newMarkers.push({
    //             lat: stop.coords?.toHome?.lat,
    //             lng: stop.coords?.toHome?.lng,
    //             studentId: student.id,
    //             name: student.name,
    //             draggable: false,
    //             color: COLORS_HEX.rutes,
    //           });
    //         }
    //       }
    //     });
    // });
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
  }, [students, temporalToHome, temporalToSchool, day]);

  return { markers, setMarkersFromStudents };
};

export default useMarkersMap;
