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
import { toast } from "sonner";
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

const ALL_DAY = "all";
const SELECT_DAY = DAYS_OPTIONS.slice(1);

const StepStops = ({ name }) => {
  const { values, setFieldValue, errors } = useFormikContext();
  const { studentsRoutes, getStudentsRoutes } = useStudentsStore();
  const { selectedDayEdit, setSelectedDayEdit, typeTravel, setTypeTravel } =
    useRoutesStore();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [bothTravels, setBothTravels] = useState(true);
  const [selectedDay, setSelectedDay] = useState(["all"]);
  const [isEditStudent, setIsEditStudent] = useState(false);
  const [studentsData, setStudentsData] = useState([]);
  const [selectedStudentToRemove, setSelectedStudentToRemove] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [disabledAddStudent, setDisabledAddStudent] = useState(true);

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
      console.log("that");
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
        getStudentsRoutes(filterStudents);
      });
    } else {
      const filterStudents = studentsRoutes.filter((student) => {
        if (typeTravel === "workshop") return true;
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

  useEffect(() => {
    if (errors) {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
    }
  }, [errors]);

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
  const handleClearStudent = (e = false) => {
    e && e.preventDefault();
    setSelectedStudent(null);
    setFieldValue("temporalToHome", null);
    setFieldValue("temporalToSchool", null);
    setSelectedDay(["all"]);
    setBothTravels(false);
    setIsEditStudent(false);
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
      toast.error("Error al eliminar el estudiante");
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
      toast.error("Error al eliminar el estudiante");
    } finally {
      setOpenDeleteDialog(false);
    }
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

  const openDeleteModal = (student) => {
    if (!openDeleteDialog) {
      setSelectedStudentToRemove(student);
    } else {
      setSelectedStudentToRemove(null);
    }
    setOpenDeleteDialog(!openDeleteDialog);
  };

  return (
    <div className={`mb-4 grid grid-rows-2 divide-y-2`}>
      <div>
        <Label>{name}</Label>
      </div>
      <div className="row-span-1">
        <div className="grid grid-flow-row gap-2">
          {typeTravel === "workshop" && (
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
          )}
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
              { label: "Escuela - Casa", value: "toHome" },
              { label: "Casa - Escuela", value: "toSchool" },
            ]}
            value={typeTravel}
            onValueChange={(value) => {
              handleClearStudent();
              setTypeTravel(value);
            }}
          />
        )}
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
