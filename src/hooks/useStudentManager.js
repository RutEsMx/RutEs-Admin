import { useFormikContext } from "formik";
import { DAYS } from "@/utils/options";

const ALL_DAY = "all"; // Asumiendo que tienes una constante para 'all'

function useStudentManager() {
  const { values, setFieldValue } = useFormikContext();

  const addOrUpdateStudent = (
    selectedStudent,
    selectedDay,
    bothTravels,
    typeTravel,
    temporalToHome,
    temporalToSchool,
  ) => {
    const students = values.students || {};

    const updateStudentArray = (day, type, studentObj) => {
      if (!students[day]) {
        students[day] = {};
      }

      if (!students[day][type]) {
        students[day][type] = [];
      }

      const studentIndex = students[day]?.[type]?.findIndex(
        (s) => s.id === selectedStudent.id,
      );
      if (studentIndex !== -1) {
        students[day][type][studentIndex] = {
          ...students[day][type][studentIndex],
          ...studentObj,
        };
      } else {
        students[day][type] = [...(students[day][type] || []), studentObj];
      }
    };

    const createStop = (coords) => {
      return {
        coords,
      };
    };

    if (selectedDay.includes(ALL_DAY)) {
      Object.keys(DAYS).forEach((day) => {
        if (bothTravels) {
          const stop = createStop(temporalToHome);
          const studentObj = { ...selectedStudent, stop };
          updateStudentArray(day, "toHome", studentObj);
          updateStudentArray(day, "toSchool", studentObj);
        } else {
          if (selectedStudent.serviceType === "halfMorning") {
            const stop = createStop(temporalToSchool);
            const studentObj = { ...selectedStudent, stop };
            updateStudentArray(day, "toHome", studentObj);
          } else if (selectedStudent.serviceType === "halfAfternoon") {
            const stop = createStop(temporalToHome);
            const studentObj = { ...selectedStudent, stop };
            updateStudentArray(day, "toSchool", studentObj);
          } else {
            if (temporalToHome) {
              const stop = createStop(temporalToHome);
              const studentObj = { ...selectedStudent, stop };
              updateStudentArray(day, "toHome", studentObj);
            }
            if (temporalToSchool) {
              const stop = createStop(temporalToSchool);
              const studentObj = { ...selectedStudent, stop };
              updateStudentArray(day, "toSchool", studentObj);
            }
          }
        }
      });
    } else {
      selectedDay.forEach((day) => {
        if (bothTravels) {
          const stop = createStop(temporalToHome);
          const studentObj = { ...selectedStudent, stop };
          updateStudentArray(day, "toHome", studentObj);
          updateStudentArray(day, "toSchool", studentObj);
        } else {
          if (selectedStudent.serviceType === "halfMorning") {
            const stop = createStop(temporalToSchool);
            const studentObj = { ...selectedStudent, stop };
            updateStudentArray(day, "toHome", studentObj);
          } else if (selectedStudent.serviceType === "halfAfternoon") {
            const stop = createStop(temporalToHome);
            const studentObj = { ...selectedStudent, stop };
            updateStudentArray(day, "toSchool", studentObj);
          } else {
            if (temporalToHome) {
              const stop = createStop(temporalToHome);
              const studentObj = { ...selectedStudent, stop };
              updateStudentArray(day, "toHome", studentObj);
            }
            if (temporalToSchool) {
              const stop = createStop(temporalToSchool);
              const studentObj = { ...selectedStudent, stop };
              updateStudentArray(day, "toSchool", studentObj);
            }
          }
        }
      });
    }
    setFieldValue("students", students);
  };

  const resetForm = () => {
    setFieldValue("temporalToHome", null);
    setFieldValue("temporalToSchool", null);
  };

  return {
    addOrUpdateStudent,
    resetForm,
  };
}

export default useStudentManager;
