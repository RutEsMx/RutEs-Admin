import Autocomplete from "@/components/Autocomplete";
import { useStudentsStore } from "@/store/useStudentsStore";
import { useFormikContext } from "formik";
import { memo } from "react";
import { useRouter } from "next/navigation";
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

const ALL_DAY = "all";
const SELECT_DAY = DAYS_OPTIONS.slice(1);

const StepStops = ({ isEdit }) => {
  const { values, setFieldValue } = useFormikContext();
  const navigation = useRouter();
  const { selectedDayEdit, setSelectedDayEdit } = useRoutesStore();
  const { allStudents } = useStudentsStore();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [bothTravels, setBothTravels] = useState(false);
  const [selectedDay, setSelectedDay] = useState(["all"]);
  const [isEditStudent, setIsEditStudent] = useState(false);

  const students = values?.students?.filter((student) => {
    const stop = student.stops.find((stop) =>
      isEdit
        ? stop.day === selectedDayEdit &&
          stop.route === values.routeId &&
          !stop.isDelete
        : stop,
    );
    return stop;
  });
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!selectedStudent)
      return setAlert({
        message: "Selecciona un alumno",
        type: "error",
        show: true,
      });

    if (students.find((s) => s.id === selectedStudent.id) && !isEditStudent) {
      return setAlert({
        message: "El alumno ya fue agregado",
        type: "error",
        show: true,
      });
    }
    const stops = [];
    if (selectedDay.includes(ALL_DAY)) {
      Object.keys(DAYS).forEach((day) => {
        console.log(
          "🚀 ~ file: index.jsx:69 ~ Object.keys ~ values?.temporalToHome:",
          values?.temporalToHome,
        );
        console.log(
          "🚀 ~ file: index.jsx:69 ~ Object.keys ~ values?.temporalToHome:",
          values?.temporalToSchool,
        );
        stops.push({
          day,
          coords: {
            toHome: values?.temporalToHome,
            toSchool: bothTravels
              ? values?.temporalToHome
              : values?.temporalToSchool || null,
          },
          isDelete: false,
          route: values.routeId,
        });
      });
    } else {
      selectedDay.forEach((day) => {
        stops.push({
          day,
          coords: {
            toHome: values?.temporalToHome,
            toSchool: bothTravels
              ? values?.temporalToHome
              : values?.temporalToSchool || null,
          },
          isDelete: false,
          route: values.routeId,
        });
      });
    }

    const studentObj = {
      id: selectedStudent?.id,
      name: selectedStudent?.name,
      lastName: selectedStudent?.lastName,
      secondLastName: selectedStudent?.secondLastName,
      stops,
    };
    console.log(
      "🚀 ~ file: index.jsx:100 ~ handleAddStudent ~ studentObj:",
      studentObj,
    );
    setAlert({ message: "", type: "", show: false });
    setFieldValue("temporalToHome", null);
    setFieldValue("temporalToSchool", null);
    if (isEditStudent) {
      setFieldValue(
        "students",
        values.students.map((s) => (s.id === studentObj.id ? studentObj : s)),
      );
    } else {
      setFieldValue("students", [...values.students, studentObj]);
    }
    setSelectedStudent(null);
    setIsEditStudent(false);
  };

  const handleClearStudent = (e) => {
    e.preventDefault();
    setSelectedStudent(null);
    setFieldValue("temporalToHome", null);
    setFieldValue("temporalToSchool", null);
    setSelectedDay("all");
    setBothTravels(true);
    setIsEditStudent(false);
  };

  const handleEditStudent = (e, student) => {
    e.preventDefault();
    if (isEdit)
      return navigation.push(`/dashboard/students/edit/${student.id}`);
    setSelectedStudent(student);
    setFieldValue("temporalToHome", student.stops[0].coords.toHome);
    setFieldValue("temporalToSchool", student.stops[0].coords.toSchool);
    setIsEditStudent(true);
  };

  const handleRemoveStudent = (e, student) => {
    e.preventDefault();
    if (isEdit) {
      const stops = student.stops.map((stop) => {
        if (stop.day === selectedDayEdit) {
          return {
            ...stop,
            isDelete: true,
          };
        }
        return stop;
      });
      setFieldValue(
        "students",
        values.students.map((s) => (s.id === student.id ? { ...s, stops } : s)),
      );
      return;
    }
    setFieldValue(
      "students",
      values.students.filter((s) => s.id !== student?.id),
    );
    setIsEditStudent(false);
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
    const element = allStudents.find((student) => student.id === value);

    setSelectedStudent(element);
  };

  return (
    <div className={`mb-4 grid ${isEdit ? "grid-rows-1" : "grid-rows-2"}`}>
      <div className="row-span-1">
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3">
            <div className="mx-2">
              <div className="form-control grid grid-cols-2 place-content-center">
                {DAYS_OPTIONS.map((day) => (
                  <div key={day.label} className="grid">
                    <label className="cursor-pointer label">
                      <span className="label-text text-xs">{day.label}</span>
                      <input
                        type="checkbox"
                        name={day.value}
                        checked={selectedDay.includes(day.value)}
                        className="checkbox checkbox-xs"
                        onChange={handleSelect}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <Autocomplete
              options={allStudents}
              placeholder="Selecciona un alumno"
              onSelect={handleSelectedStudent}
              name="student"
              value={selectedStudent?.id || null}
              disabled={isEditStudent}
            />
            {validateServiceType({
              serviceType: selectedStudent?.serviceType,
              setBothTravels,
              setFieldValue,
              values,
              bothTravels,
            })}
          </div>
          <div className="col-span-1 mb-2">
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
      <div className="mx-2 row-span-1 my-6">
        <div className="w-full bg-gray-hover px-2 mb-4">Paradas</div>
        {isEdit && (
          <SelectField
            label="Día"
            name="day"
            options={SELECT_DAY}
            value={selectedDayEdit}
            onChange={(e) => setSelectedDayEdit(e.target.value)}
          />
        )}
        {students?.map((student) => (
          <div key={student.id} className="grid grid-cols-3 gap-2 my-2">
            <div className="col-span-2">
              <div className="flex flex-row items-center">
                <MapPinIcon className="h-4 w-4 text-yellow" />
                <div className="flex ps-2">
                  <span className="text-sm font-semibold">{student?.name}</span>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex justify-end pe-4 gap-2">
                <ButtonAction
                  onClick={(e) => handleRemoveStudent(e, student)}
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
    </div>
  );
};

const MemoStepStops = memo(StepStops);

export default MemoStepStops;
