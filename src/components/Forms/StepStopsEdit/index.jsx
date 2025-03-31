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
import { DAYS, DAYS_OPTIONS } from "@/utils/options";
import SelectField from "@/components/SelectField";
import { useRoutesStore } from "@/store/useRoutesStore";
import { validateServiceType } from "@/utils/functionsClient";
import SelectAutocomplete from "@/components/SelectAutocomplete";
import { useStudentsStore } from "@/store/useStudentsStore";
import useStudentManager from "@/hooks/useStudentManager";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

const ALL_DAY = "all";
const SELECT_DAY = DAYS_OPTIONS.slice(1);

const StepStopsEdit = ({ name }) => {
  const { values, setFieldValue } = useFormikContext();
  const { studentsRoutes } = useStudentsStore();
  const { selectedDayEdit, setSelectedDayEdit, typeTravel, setTypeTravel } =
    useRoutesStore();
  const [parentRef, studentsData, setStudentsData] = useDragAndDrop(
    values?.students?.[selectedDayEdit]?.[typeTravel] || [],
  );
  const [selectedStudentToRemove, setSelectedStudentToRemove] = useState(null);
  const [selectedDay, setSelectedDay] = useState([]);
  const [bothTravels, setBothTravels] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditStudent, setIsEditStudent] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [disabledAddStudent, setDisabledAddStudent] = useState(true);

  useEffect(() => {
    setSelectedDay(["all"]);
  }, []);

  useEffect(() => {
    setFieldValue("students", {
      ...values?.students,
      [selectedDayEdit]: {
        ...values?.students?.[selectedDayEdit],
        [typeTravel]: studentsData,
      },
    });
  }, [studentsData]);

  // Reiniciar formulario
  const handleReset = () => {
    setSelectedDay(["all"]);
    setSelectedStudent(null);
    setIsEditStudent(false);
    setBothTravels(false);
    resetForm();
  };
  useEffect(() => {
    if (bothTravels && values?.temporalToHome) {
      setDisabledAddStudent(false);
      return;
    } else if (
      (values?.temporalToHome && values?.temporalToSchool) ||
      values?.temporalWorkshop ||
      isEditStudent
    ) {
      setDisabledAddStudent(false);
    } else {
      setDisabledAddStudent(true);
    }
  }, [values, bothTravels]);

  const { addOrUpdateStudent, resetForm } = useStudentManager();

  useEffect(() => {
    setStudentsData(values?.students?.[selectedDayEdit]?.[typeTravel] || []);
  }, [selectedDayEdit, typeTravel, values]);

  useEffect(() => {
    if (selectedDay.includes(ALL_DAY)) {
      Object.keys(DAYS).forEach((day) => {
        const filterStudents = studentsRoutes.filter((student) => {
          if (typeTravel === "workshop") return true;
          if (!student.stops) return true;
          return !student.stops.some((stop) => stop.day === day);
        });
        setAvailableStudents(filterStudents);
      });
    } else {
      const filterStudents = studentsRoutes.filter((student) => {
        if (typeTravel === "workshop") return true;
        if (!student.stops) return true;
        return !student.stops.some(
          (stop) => selectedDay.includes(stop.day) && stop.type === typeTravel,
        );
      });
      setAvailableStudents(filterStudents);
    }
  }, [selectedDay]);

  useEffect(() => {
    getAvailableStudents();
  }, [isEditStudent]);

  const getAvailableStudents = () => {
    const oldStudent = studentsRoutes.find(
      (student) => student?.id === selectedStudent?.id,
    );
    const studentWithoutRoute = studentsRoutes.filter(
      (student) => !student?.stops,
    );
    if (oldStudent) {
      if (
        !studentWithoutRoute.find((student) => student?.id === oldStudent.id)
      ) {
        studentWithoutRoute.push(oldStudent);
      }
    }
    setAvailableStudents(studentWithoutRoute);
  };

  const handleRemoveStudent = (e) => {
    e.preventDefault();
    try {
      const students = values?.students || {};
      let updatedStudentsToRemove = { ...values.studentsToRemove };
      if (!updatedStudentsToRemove[selectedDayEdit]) {
        updatedStudentsToRemove[selectedDayEdit] = { [typeTravel]: [] };
      }

      updatedStudentsToRemove[selectedDayEdit][typeTravel] = [
        ...(updatedStudentsToRemove[selectedDayEdit][typeTravel] || []),
        selectedStudentToRemove,
      ];

      const newStudents = students?.[selectedDayEdit]?.[typeTravel]?.filter(
        (s) => s.id !== selectedStudentToRemove.id,
      );

      setFieldValue("students", {
        ...values?.students,
        [selectedDayEdit]: {
          ...values?.students?.[selectedDayEdit],
          [typeTravel]: newStudents,
        },
      });
      setFieldValue("studentsToRemove", updatedStudentsToRemove);
    } catch (error) {
      toast.error("Error al eliminar el alumno");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleRemoveStudentAll = (e) => {
    e.preventDefault();
    try {
      const students = values?.students || {};
      const newStudents = values?.students || {};
      let updatedStudentsToRemove = { ...values.studentsToRemove };
      Object.keys(students).forEach((day) => {
        if (!updatedStudentsToRemove[day]) {
          updatedStudentsToRemove[day] = { [typeTravel]: [] };
        }
        const studentToRemove = students[day][typeTravel].find(
          (s) => s.id === selectedStudentToRemove.id,
        );
        updatedStudentsToRemove[day][typeTravel] = [
          ...(updatedStudentsToRemove[day][typeTravel] || []),
          studentToRemove,
        ];
        newStudents[day][typeTravel] = newStudents[day][typeTravel].filter(
          (s) => s.id !== selectedStudentToRemove.id,
        );
      });

      setFieldValue("studentsToRemove", updatedStudentsToRemove);
      setStudentsData(newStudents[selectedDayEdit][typeTravel]);
    } catch (error) {
      toast.error("Error al eliminar el alumno");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const openDeleteModal = (student) => {
    if (!openDeleteDialog) {
      setSelectedStudentToRemove(student);
    } else {
      setSelectedStudentToRemove(null);
    }
    setOpenDeleteDialog(!openDeleteDialog);
  };

  const handleEditStudent = (e, student) => {
    e.preventDefault();
    if (!student) return setIsEditStudent(false);
    student["value"] = student.id;
    setSelectedStudent(student);
    if (student?.serviceType === "halfMorning") {
      setFieldValue("temporalToSchool", student?.stop?.coords || null);
    } else if (student?.serviceType === "halfAfternoon") {
      if (typeTravel === "workshop")
        setFieldValue("temporalWorkshop", student?.stop?.coords || null);
      else setFieldValue("temporalToHome", student?.stop?.coords || null);
    } else {
      if (typeTravel === "toHome")
        setFieldValue("temporalToHome", student?.stop?.coords || null);
      if (typeTravel === "toSchool")
        setFieldValue("temporalToSchool", student?.stop?.coords || null);
      if (typeTravel === "workshop")
        setFieldValue("temporalWorkshop", student?.stop?.coords || null);
    }
    setSelectedDay([selectedDayEdit]);
    setIsEditStudent(true);
  };

  const handleSelect = (e) => {
    const { name, checked } = e.target;

    setSelectedDay((prevState) => {
      const selected = [...prevState];
      if (name === ALL_DAY) return [ALL_DAY];

      if (!selected.includes(name) && checked) {
        selected.push(name);
        if (name !== ALL_DAY && checked && selected.includes(ALL_DAY)) {
          selected.splice(selected?.indexOf(ALL_DAY), 1);
        }
      } else {
        selected.splice(selected?.indexOf(name), 1);
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

  const handleClearStudent = (e = false) => {
    e && e.preventDefault();
    setSelectedStudent(null);
    setFieldValue("temporalToHome", null);
    setFieldValue("temporalToSchool", null);
    setFieldValue("temporalWorkshop", null);
    setSelectedDay(["all"]);
    setBothTravels(false);
    setIsEditStudent(false);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const { temporalToHome, temporalToSchool, temporalWorkshop } = values;
    addOrUpdateStudent(
      selectedStudent,
      selectedDay,
      bothTravels,
      typeTravel,
      temporalToHome,
      temporalToSchool,
      temporalWorkshop,
    );
    handleReset();
    setDisabledAddStudent(true);
  };

  return (
    <div className="mb-4 grid grid-rows-1 divide-y-2">
      <div>
        <Label>{name}</Label>
      </div>
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
                    <span className="label-text text-xs text-start ml-2">
                      {day.label}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              {isEditStudent ? (
                <div className="ml-2 text-sm bg-slate-300 opacity-80 p-2">
                  <span>
                    {`${selectedStudent?.name || ""} ${
                      selectedStudent?.lastName || ""
                    } ${selectedStudent?.secondLastName || ""}`}
                  </span>
                </div>
              ) : (
                <SelectAutocomplete
                  placeholder="Buscar un alumno"
                  onSelect={handleSelectedStudent}
                  name="student"
                  value={selectedStudent || null}
                  disabled={isEditStudent}
                  days={selectedDay}
                  options={availableStudents}
                />
              )}
              {validateServiceType({
                serviceType: selectedStudent?.serviceType,
                setBothTravels,
                setFieldValue,
                values,
                bothTravels,
                address:
                  `${selectedStudent?.address?.street || ""} ${
                    selectedStudent?.address?.number || ""
                  } ${selectedStudent?.address?.interiorNumber || ""} ${
                    selectedStudent?.address?.neighborhood || ""
                  } ${selectedStudent?.address?.postalCode || ""} ${
                    selectedStudent?.address?.city || ""
                  } ${selectedStudent?.address?.state || ""}` || "",
                isEditStudent,
                typeTravel,
                selectedStudent,
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
                <ButtonAction
                  onClick={handleAddStudent}
                  disabled={disabledAddStudent}
                >
                  <CheckIcon className="h-5 w-5 text-black" />
                </ButtonAction>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-2 row-span-1 my-6">
        <div className="w-full bg-gray-hover px-2 my-4">
          Información de Paradas
        </div>
        <SelectField
          labelTitle="Día"
          name="day"
          options={SELECT_DAY}
          value={selectedDayEdit}
          onValueChange={(value) => {
            handleClearStudent();
            setSelectedDayEdit(value);
          }}
        />
        {typeTravel !== "workshop" && (
          <SelectField
            labelTitle="Tipo de viaje"
            name="typeTravel"
            options={[
              { label: "Viaje a Casa", value: "toHome" },
              { label: "Viaje a Escuela", value: "toSchool" },
            ]}
            value={typeTravel}
            onValueChange={(value) => {
              handleClearStudent();
              setTypeTravel(value);
            }}
          />
        )}
        <ul ref={parentRef}>
          {studentsData?.map((student) => {
            if (!student) return null;
            return (
              <li
                key={student?.id}
                className="grid grid-cols-3 gap-2 my-2 self-center bg-slate-300/60 items-center px-2 py-2 rounded-md cursor-grab"
                data-label={student.id}
              >
                <div className="col-span-2">
                  <div className="flex flex-row items-center">
                    <MapPinIcon className="h-4 w-4 text-yellow" />
                    <div className="flex ps-2">
                      <span className="text-sm font-semibold">{`${
                        student?.name || ""
                      } ${student?.lastName || ""} ${
                        student?.secondLastName || ""
                      }`}</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex justify-end pe-4 gap-2">
                    <Dialog
                      open={openDeleteDialog}
                      onOpenChange={() => openDeleteModal(student)}
                    >
                      <DialogTrigger asChild>
                        <ButtonAction disabled={false} color="bg-light-gray">
                          <TrashIcon className="h-4 w-4 text-black" />
                        </ButtonAction>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>
                            ¿Deseas eliminar la parada todos los dias?
                          </DialogTitle>
                          <DialogDescription>
                            {`
                            Al seleccionar "Todos" se eliminará las paradas de todos los días de
                          `}
                            {typeTravel === "workshop" ? (
                              <Label className="text-base">Taller</Label>
                            ) : typeTravel === "toHome" ? (
                              <Label className="text-base">viaje a casa</Label>
                            ) : (
                              <Label className="text-base">
                                viaje a la escuela
                              </Label>
                            )}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <div className="flex flex-row gap-4">
                            <ButtonAction
                              color="bg-warning"
                              onClick={() => setOpenDeleteDialog(false)}
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
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <ButtonAction
                      onClick={(e) => handleEditStudent(e, student)}
                      disabled={false}
                    >
                      <PencilIcon className="h-4 w-4 text-black" />
                    </ButtonAction>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const MemoStepStopsEdit = memo(StepStopsEdit);

export default MemoStepStopsEdit;
