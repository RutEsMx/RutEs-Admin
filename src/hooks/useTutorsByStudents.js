import { useEffect, useState } from "react";
import { useParentsStore } from "@/store/useParentsStore";

const useTutorsByStudents = (student) => {
  const { rows } = useParentsStore((state) => state.parents);
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    if (rows?.length > 0) {
      const tutorsByStudent = rows.filter((tutor) => {
        return tutor?.students?.some((studentByTutor) => {
          return (
            studentByTutor.id === student.id && tutor?.roles?.includes("tutor")
          );
        });
      });
      setTutors(tutorsByStudent);
    }
  }, [rows]);

  return {
    tutors,
  };
};

export default useTutorsByStudents;
