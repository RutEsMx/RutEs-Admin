import { useEffect, useState } from "react";

const orderDay = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const useStopsStudentDetails = (student) => {
  const [stops, setStops] = useState([]);

  useEffect(() => {
    if (student?.stops?.length > 0) {
      // Clasificar las paradas dia a dia
      const stopsByDay = orderDay.map((day) => {
        return student.stops
          .filter((stop) => stop.day === day)
          .sort((a, b) => a.type.localeCompare(b.type));
      });
      setStops(stopsByDay);
    } else {
      setStops([]);
    }
  }, [student]);

  return {
    stops,
  };
};

export default useStopsStudentDetails;
