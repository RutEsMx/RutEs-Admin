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
    temporalWorkshop,
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
        let stop = null;
        if (typeTravel === "workshop") {
          const currentStudentByDay = students[day]?.[typeTravel]?.find(
            (s) => s.id === selectedStudent.id,
          );
          if (currentStudentByDay?.stop) {
            stop = currentStudentByDay?.stop;
            stop.coords = temporalWorkshop;
          } else {
            stop = createStop(temporalWorkshop);
          }
          const studentObj = { ...selectedStudent, stop };
          updateStudentArray(day, "workshop", studentObj);
        } else if (bothTravels) {
          const currentStudentByDayToHome = students[day]?.["toHome"]?.find(
            (s) => s.id === selectedStudent.id,
          );
          const currentStudentByDayToSchool = students[day]?.["toSchool"]?.find(
            (s) => s.id === selectedStudent.id,
          );
          let stopToHome = null;
          let stopToSchool = null;
          if (currentStudentByDayToHome?.stop) {
            stopToHome = currentStudentByDayToHome?.stop;
            stopToHome.coords = temporalToHome;
          } else {
            stopToHome = createStop(temporalToHome);
          }
          if (currentStudentByDayToSchool?.stop) {
            stopToSchool = currentStudentByDayToSchool?.stop;
            stopToSchool.coords = temporalToHome;
          } else {
            stopToSchool = createStop(temporalToHome);
          }

          const studentObjToHome = { ...selectedStudent, stop: stopToHome };
          const studentObjToSchool = { ...selectedStudent, stop: stopToSchool };
          updateStudentArray(day, "toHome", studentObjToHome);
          updateStudentArray(day, "toSchool", studentObjToSchool);
        } else {
          if (selectedStudent.serviceType === "halfMorning") {
            const currentStudentByDay = students[day]?.["toSchool"]?.find(
              (s) => s.id === selectedStudent.id,
            );
            if (currentStudentByDay?.stop) {
              stop = currentStudentByDay?.stop;
              stop.coords = temporalToSchool;
            } else {
              stop = createStop(temporalToSchool);
            }
            const studentObj = { ...selectedStudent, stop };
            updateStudentArray(day, "toSchool", studentObj);
          } else if (selectedStudent.serviceType === "halfAfternoon") {
            const currentStudentByDay = students[day]?.["toHome"]?.find(
              (s) => s.id === selectedStudent.id,
            );
            if (currentStudentByDay?.stop) {
              stop = currentStudentByDay?.stop;
              stop.coords = temporalToHome;
            } else {
              stop = createStop(temporalToHome);
            }
            const studentObj = { ...selectedStudent, stop };
            updateStudentArray(day, "toHome", studentObj);
          } else {
            if (temporalToHome) {
              const currentStudentByDay = students[day]?.["toHome"]?.find(
                (s) => s.id === selectedStudent.id,
              );
              if (currentStudentByDay?.stop) {
                stop = currentStudentByDay?.stop;
                stop.coords = temporalToHome;
              } else {
                stop = createStop(temporalToHome);
              }
              const studentObj = { ...selectedStudent, stop };
              updateStudentArray(day, "toHome", studentObj);
            }
            if (temporalToSchool) {
              const currentStudentByDay = students[day]?.["toSchool"]?.find(
                (s) => s.id === selectedStudent.id,
              );
              if (currentStudentByDay?.stop) {
                stop = currentStudentByDay?.stop;
                stop.coords = temporalToSchool;
              } else {
                stop = createStop(temporalToSchool);
              }
              const studentObj = { ...selectedStudent, stop };
              updateStudentArray(day, "toSchool", studentObj);
            }
          }
        }
      });
    } else {
      selectedDay.forEach((day) => {
        let stop = null;

        if (typeTravel === "workshop") {
          const currentStudentByDay = students[day]?.[typeTravel]?.find(
            (s) => s.id === selectedStudent.id,
          );
          if (currentStudentByDay?.stop) {
            stop = currentStudentByDay?.stop;
            stop.coords = temporalWorkshop;
          } else {
            stop = createStop(temporalWorkshop);
          }
          const studentObj = { ...selectedStudent, stop };
          updateStudentArray(day, "workshop", studentObj);
        } else if (bothTravels) {
          const currentStudentByDayToHome = students[day]?.["toHome"]?.find(
            (s) => s.id === selectedStudent.id,
          );
          const currentStudentByDayToSchool = students[day]?.["toSchool"]?.find(
            (s) => s.id === selectedStudent.id,
          );
          let stopToHome = null;
          let stopToSchool = null;
          if (currentStudentByDayToHome?.stop) {
            stopToHome = currentStudentByDayToHome?.stop;
            stopToHome.coords = temporalToHome;
          } else {
            stopToHome = createStop(temporalToHome);
          }
          if (currentStudentByDayToSchool?.stop) {
            stopToSchool = currentStudentByDayToSchool?.stop;
            stopToSchool.coords = temporalToHome;
          } else {
            stopToSchool = createStop(temporalToHome);
          }

          const studentObjToHome = { ...selectedStudent, stop: stopToHome };
          const studentObjToSchool = { ...selectedStudent, stop: stopToSchool };
          updateStudentArray(day, "toHome", studentObjToHome);
          updateStudentArray(day, "toSchool", studentObjToSchool);
        } else {
          if (selectedStudent.serviceType === "halfMorning") {
            const currentStudentByDay = students[day]?.["toSchool"]?.find(
              (s) => s.id === selectedStudent.id,
            );
            if (currentStudentByDay?.stop) {
              stop = currentStudentByDay?.stop;
              stop.coords = temporalToSchool;
            } else {
              stop = createStop(temporalToSchool);
            }
            const studentObj = { ...selectedStudent, stop };
            updateStudentArray(day, "toHome", studentObj);
          } else if (selectedStudent.serviceType === "halfAfternoon") {
            const currentStudentByDay = students[day]?.["toHome"]?.find(
              (s) => s.id === selectedStudent.id,
            );
            if (currentStudentByDay?.stop) {
              stop = currentStudentByDay?.stop;
              stop.coords = temporalToHome;
            } else {
              stop = createStop(temporalToHome);
            }
            const studentObj = { ...selectedStudent, stop };
            updateStudentArray(day, "toSchool", studentObj);
          } else {
            if (temporalToHome) {
              const currentStudentByDay = students[day]?.["toHome"]?.find(
                (s) => s.id === selectedStudent.id,
              );
              if (currentStudentByDay?.stop) {
                stop = currentStudentByDay?.stop;
                stop.coords = temporalToHome;
              } else {
                stop = createStop(temporalToHome);
              }
              const studentObj = { ...selectedStudent, stop };
              updateStudentArray(day, "toHome", studentObj);
            }
            if (temporalToSchool) {
              const currentStudentByDay = students[day]?.["toSchool"]?.find(
                (s) => s.id === selectedStudent.id,
              );
              if (currentStudentByDay?.stop) {
                stop = currentStudentByDay?.stop;
                stop.coords = temporalToSchool;
              } else {
                stop = createStop(temporalToSchool);
              }
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
    setFieldValue("temporalWorkshop", null);
  };

  return {
    addOrUpdateStudent,
    resetForm,
  };
}

export default useStudentManager;
