import { useFormikContext } from "formik";
import { memo, useEffect } from "react";
import {
  MapPinIcon,
  CheckIcon,
  PencilIcon,
  XMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import ButtonAction from "@/components/ButtonAction";
import { useState } from "react";
import { setAlert } from "@/store/useSystemStore";
import { DAYS, DAYS_OPTIONS } from "@/utils/options";
import SelectField from "@/components/SelectField";
import { useRoutesStore } from "@/store/useRoutesStore";
import { validateServiceType } from "@/utils/functionsClient";
import SelectAutocomplete from "@/components/SelectAutocomplete";
import { useStudentsStore } from "@/store/useStudentsStore";

const ALL_DAY = "all";
const SELECT_DAY = DAYS_OPTIONS.slice(1);

const StepStops = () => {
  const { values, setFieldValue } = useFormikContext();
  const { studentsRoutes, getStudentsRoutes } = useStudentsStore();
  const { selectedDayEdit, setSelectedDayEdit, typeTravel, setTypeTravel } =
    useRoutesStore();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [bothTravels, setBothTravels] = useState(false);
  const [selectedDay, setSelectedDay] = useState([]);
  const [isEditStudent, setIsEditStudent] = useState(false);
  const [studentsData, setStudentsData] = useState([]);
  const [selectedStudentToRemove, setSelectedStudentToRemove] = useState(null);

  useEffect(() => {
    setStudentsData(values?.students?.[selectedDayEdit]?.[typeTravel] || []);
  }, [selectedDayEdit, typeTravel, values]);

  useEffect(() => {
    if (selectedDay.includes(ALL_DAY)) {
      Object.keys(DAYS).forEach((day) => {
        const filterStudents = studentsRoutes.filter((student) => {
          if (!student.stops) return true;
          return !student.stops.some((stop) => stop.day === day);
        });
        getStudentsRoutes(filterStudents);
      });
    } else {
      const filterStudents = studentsRoutes.filter((student) => {
        if (!student.stops) return true;
        return !student.stops.some((stop) => selectedDay.includes(stop.day));
      });
      getStudentsRoutes(filterStudents);
    }
  }, [selectedDay]);

  useEffect(() => {
    setFieldValue("temporalToHome", null);
    setFieldValue("temporalToSchool", null);
  }, [bothTravels]);

  const validateStudentExist = (student) => {
    const students = values?.students || {};
    let found = false;

    const checkStudent = (day) => {
      if (students[day]?.[typeTravel]?.some((s) => s.id === student.id)) {
        found = true;
        return true;
      }
      return false;
    };

    if (selectedDay.includes(ALL_DAY)) {
      Object.keys(DAYS).some(checkStudent);
    } else {
      selectedDay.some(checkStudent);
    }

    return found;
  };

  const handleAddStudent = (e) => {
    e.preventDefault();

    if (!selectedStudent)
      return setAlert({
        message: "Selecciona un alumno",
        type: "error",
        show: true,
      });
    // Validar si ya existe el alumno en el dia seleccionado
    const validate = validateStudentExist(selectedStudent);
    if (validate && !isEditStudent) {
      setAlert({
        message: "El alumno ya existe en uno de los días seleccionados",
        type: "error",
        show: true,
      });
      return;
    }

    if (selectedStudent?.serviceType === "complete") {
      if (
        !bothTravels &&
        !values?.temporalToHome &&
        !values?.temporalToSchool
      ) {
        return setAlert({
          message: "Selecciona una dirección",
          type: "error",
          show: true,
        });
      } else if (bothTravels && !values?.temporalToHome) {
        return setAlert({
          message: "Selecciona una dirección",
          type: "error",
          show: true,
        });
      }
    }
    if (
      selectedStudent?.serviceType === "halfMorning" &&
      !values?.temporalToSchool
    ) {
      return setAlert({
        message: "Selecciona una dirección",
        type: "error",
        show: true,
      });
    }
    if (
      selectedStudent?.serviceType === "halfAfternoon" &&
      !values?.temporalToHome
    ) {
      return setAlert({
        message: "Selecciona una dirección",
        type: "error",
        show: true,
      });
    }
    const students = values?.students || {};
    const studentObj = {
      ...selectedStudent,
      stop: "",
    };

    if (selectedDay.includes(ALL_DAY)) {
      Object.keys(DAYS).forEach((day) => {
        if (!students[day]) {
          students[day] = {
            toHome: [],
            toSchool: [],
          };
        }
        if (bothTravels) {
          studentObj["stop"] = {
            coords: {
              toHome: values?.temporalToHome || null,
              toSchool: values?.temporalToHome || null,
            },
            isDelete: false,
          };
          if (isEditStudent) {
            const studentIndex = values?.students?.[day]?.[
              typeTravel
            ]?.findIndex((s) => s.id === selectedStudent.id);
            if (studentIndex !== -1) {
              // update the student object with the new data
              const updatedStudent = {
                ...values.students[day][typeTravel][studentIndex],
                ...studentObj,
              };
              // update the students array with the updated student object
              students[day][typeTravel][studentIndex] = updatedStudent;
            }
          } else {
            students[day] = {
              ...students[day],
              toHome: [...students[day].toHome, studentObj],
              toSchool: [...students[day].toSchool, studentObj],
            };
          }
        } else {
          if (selectedStudent?.serviceType === "halfMorning") {
            studentObj["stop"] = {
              coords: {
                toHome: null,
                toSchool: values?.temporalToSchool || null,
              },
              isDelete: false,
            };
          } else if (selectedStudent?.serviceType === "halfAfternoon") {
            studentObj["stop"] = {
              coords: {
                toHome: values?.temporalToHome || null,
                toSchool: null,
              },
              isDelete: false,
            };
          } else {
            studentObj["stop"] = {
              coords: {
                toHome: values?.temporalToHome || null,
                toSchool: values?.temporalToSchool || null,
              },
              isDelete: false,
            };
          }
          if (isEditStudent) {
            const studentIndex = values?.students?.[day]?.[
              typeTravel
            ]?.findIndex((s) => s.id === selectedStudent.id);
            if (studentIndex !== -1) {
              // update the student object with the new data
              const updatedStudent = {
                ...values.students[day][typeTravel][studentIndex],
                ...studentObj,
              };
              // update the students array with the updated student object
              students[day][typeTravel][studentIndex] = updatedStudent;
            }
          } else {
            students[day] = {
              ...students[day],
              toHome: values?.temporalToHome
                ? [...students[day].toHome, studentObj]
                : students[day].toHome,
              toSchool: values?.temporalToSchool
                ? [...students[day].toSchool, studentObj]
                : students[day].toSchool,
            };
          }
        }
      });
    } else {
      selectedDay.forEach((day) => {
        if (!students[day]) {
          students[day] = {
            toHome: [],
            toSchool: [],
          };
        }
        if (bothTravels) {
          if (isEditStudent) {
            const studentIndex = values?.students?.[day]?.[
              typeTravel
            ]?.findIndex((s) => s.id === selectedStudent.id);

            if (studentIndex !== -1) {
              // update the student object with the new data
              const updatedStudent = {
                ...values.students[day][typeTravel][studentIndex],
                ...studentObj,
              };
              // update the students array with the updated student object
              students[day][typeTravel][studentIndex] = updatedStudent;
            }
          } else {
            studentObj["stop"] = {
              coords: {
                toHome: values?.temporalToHome || null,
                toSchool: values?.temporalToHome || null,
              },
              isDelete: false,
            };
          }
        } else {
          if (selectedStudent?.serviceType === "halfMorning") {
            studentObj["stop"] = {
              coords: {
                toHome: null,
                toSchool: values?.temporalToSchool || null,
              },
              isDelete: false,
            };
          } else if (selectedStudent?.serviceType === "halfAfternoon") {
            studentObj["stop"] = {
              coords: {
                toHome: values?.temporalToHome || null,
                toSchool: null,
              },
              isDelete: false,
            };
          } else {
            studentObj["stop"] = {
              coords: {
                toHome: values?.temporalToHome || null,
                toSchool: values?.temporalToSchool || null,
              },
              isDelete: false,
            };
          }
          if (isEditStudent) {
            const studentIndex = values?.students?.[day]?.[
              typeTravel
            ]?.findIndex((s) => s.id === selectedStudent.id);
            if (studentIndex !== -1) {
              // update the student object with the new data
              const updatedStudent = {
                ...values.students[day][typeTravel][studentIndex],
                ...studentObj,
              };
              // update the students array with the updated student object
              students[day][typeTravel][studentIndex] = updatedStudent;
            }
          } else {
            students[day] = {
              ...students[day],
              toHome: values?.temporalToHome
                ? [...students[day].toHome, studentObj]
                : students[day].toHome,
              toSchool: values?.temporalToSchool
                ? [...students[day].toSchool, studentObj]
                : students[day].toSchool,
            };
          }
        }
      });
    }

    setAlert({ message: "", type: "", show: false });
    setFieldValue("temporalToHome", null);
    setFieldValue("temporalToSchool", null);
    setSelectedDay(["all"]);
    setSelectedStudent(null);
    setIsEditStudent(false);
    setBothTravels(false);

    setFieldValue("students", students);
  };
  const handleClearStudent = (e) => {
    e.preventDefault();
    setSelectedStudent(null);
    setFieldValue("temporalToHome", null);
    setFieldValue("temporalToSchool", null);
    setSelectedDay(["all"]);
    setBothTravels(false);
    setIsEditStudent(false);
  };

  const handleEditStudent = (e, student) => {
    e.preventDefault();
    setSelectedStudent(student);
    setFieldValue("temporalToHome", student?.stop?.coords?.toHome || null);
    setFieldValue("temporalToSchool", student?.stop?.coords?.toSchool || null);
    setIsEditStudent(true);
  };

  const handleRemoveStudentAll = (e) => {
    e.preventDefault();
    const students = values?.students || {};
    const newStudents = Object.keys(students).reduce((acc, day) => {
      const newStudents = students[day][typeTravel].filter(
        (s) => s.id !== selectedStudentToRemove.id,
      );
      acc[day] = {
        ...students[day],
        [typeTravel]: newStudents,
      };
      return acc;
    }, {});
    setFieldValue(`students`, newStudents);
    setStudentsData(newStudents[selectedDayEdit][typeTravel]);
    const modal = document.getElementById("my_modal_1");
    modal.close();
  };

  const handleRemoveStudent = (e) => {
    e.preventDefault();
    const newStudents = values?.students?.[selectedDayEdit]?.[
      typeTravel
    ]?.filter((s) => s.id !== selectedStudentToRemove.id);
    setFieldValue("students", {
      ...values?.students,
      [selectedDayEdit]: {
        ...values?.students?.[selectedDayEdit],
        [typeTravel]: newStudents,
      },
    });
    setStudentsData(newStudents);
    const modal = document.getElementById("my_modal_1");
    modal.close();
  };

  const handleSelect = (e) => {
    const { name, checked } = e.target;

    setSelectedDay((prevState) => {
      const selected = [...prevState];
      if (name === ALL_DAY) return [ALL_DAY];

      if (!selected.includes(name) && checked) {
        selected.push(name);
        if (name !== ALL_DAY && checked && selected.includes(ALL_DAY)) {
          selected.splice(selected.indexOf(ALL_DAY), 1);
        }
      } else {
        selected.splice(selected.indexOf(name), 1);
      }

      return selected;
    });
  };

  const handleSelectedStudent = (value) => {
    if (!value) {
      return setSelectedStudent(null);
    }
    setSelectedStudent(value);
  };

  const openDeleteModal = (e, student) => {
    e.preventDefault();
    setSelectedStudentToRemove(student);
    const modal = document.getElementById("my_modal_1");
    modal.showModal();
  };

  return (
    <div className={`mb-4 grid grid-rows-2`}>
      <div className="row-span-1">
        <div className="grid grid-flow-row gap-2">
          <div className="mx-2 grid grid-cols-2">
            <div className="form-control grid grid-cols-2 place-content-center">
              {DAYS_OPTIONS.map((day) => (
                <div key={day.label} className="grid place-content-start">
                  <label className="cursor-pointer label gap-1">
                    <input
                      type="checkbox"
                      name={day.value}
                      checked={selectedDay.includes(day.value)}
                      className="checkbox checkbox-xs"
                      onChange={handleSelect}
                    />
                    <span className="label-text text-xs text-start">
                      {day.label}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <SelectAutocomplete
                placeholder="Buscar un alumno"
                onSelect={handleSelectedStudent}
                name="student"
                value={selectedStudent || null}
                disabled={isEditStudent}
                days={selectedDay}
                options={studentsRoutes}
              />
              {validateServiceType({
                serviceType: selectedStudent?.serviceType,
                setBothTravels,
                setFieldValue,
                values,
                bothTravels,
              })}
            </div>
            <div className="col-span-1 grid place-items-center place-content-center">
              <div className="flex flex-row items-end h-full gap-2">
                <ButtonAction
                  onClick={handleClearStudent}
                  disabled={false}
                  color="bg-light-gray"
                >
                  <XMarkIcon className="h-5 w-5 text-black" />
                </ButtonAction>
                <ButtonAction onClick={handleAddStudent} disabled={false}>
                  <CheckIcon className="h-5 w-5 text-black" />
                </ButtonAction>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-2 row-span-1 my-6">
        <div className="w-full bg-gray-hover px-2 mb-4">Paradas</div>
        <SelectField
          label="Día"
          name="day"
          options={SELECT_DAY}
          value={selectedDayEdit}
          onChange={(e) => setSelectedDayEdit(e.target.value)}
        />
        <SelectField
          label="Tipo de viaje"
          name="typeTravel"
          options={[
            { label: "Escuela - Casa", value: "toHome" },
            { label: "Casa - Escuela", value: "toSchool" },
          ]}
          value={typeTravel}
          onChange={(e) => setTypeTravel(e.target.value)}
        />
        {studentsData?.map((student, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 my-2">
            <div className="col-span-2">
              <div className="flex flex-row items-center">
                <MapPinIcon className="h-4 w-4 text-yellow" />
                <div className="flex ps-2 items-center">
                  <span className="text-sm font-semibold leading-6">{`${
                    student?.name || ""
                  } ${student?.lastName || ""} ${
                    student?.secondLastName || ""
                  }`}</span>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex justify-end pe-4 gap-2">
                <ButtonAction
                  onClick={(e) => openDeleteModal(e, student)}
                  disabled={false}
                  color="bg-light-gray"
                >
                  <TrashIcon className="h-4 w-4 text-black" />
                </ButtonAction>
                <ButtonAction
                  onClick={(e) => handleEditStudent(e, student)}
                  disabled={false}
                >
                  <PencilIcon className="h-4 w-4 text-black" />
                </ButtonAction>
              </div>
            </div>
          </div>
        ))}
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg"></h3>
          <p className="py-4">{`Deseas eliminar el estudiante todos los dias para ${
            typeTravel === "toHome" ? "Viaje a casa" : "Viaje a escuela"
          }? `}</p>
          <div className="modal-action">
            <ButtonAction
              color="bg-warning"
              onClick={() => document.getElementById("my_modal_1").close()}
            >
              Cancelar
            </ButtonAction>
            <ButtonAction
              color="bg-light-gray"
              onClick={handleRemoveStudentAll}
            >
              Todos
            </ButtonAction>
            <ButtonAction
              onClick={handleRemoveStudent}
            >{`Solo ${DAYS[selectedDayEdit]}`}</ButtonAction>
          </div>
        </div>
      </dialog>
    </div>
  );
};

const MemoStepStops = memo(StepStops);

export default MemoStepStops;
