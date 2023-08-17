import Autocomplete from "@/components/Autocomplete";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import { useStudentsStore } from "@/store/useStudentsStore";
import { useFormikContext } from "formik";
import { memo } from "react";
import {
  MapPinIcon,
  CheckIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import ButtonAction from "@/components/Table/elements/ButtonAction";
import { useState } from "react";
import { setAlert } from "@/store/useSystemStore";
import { DAYS, DAYS_OPTIONS } from "@/utils/options";
import SelectField from "@/components/SelectField";
import { addStops } from "@/store/useRoutesStore";

const ALL_DAY = "all";

const StepStops = () => {
  const { values, setFieldValue } = useFormikContext();
  const { allStudents } = useStudentsStore();
  const [temporalToHome, setTemporalToHome] = useState(null);
  const [temporalToSchool, setTemporalToSchool] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [bothTravels, setBothTravels] = useState(true);
  const [selectedDay, setSelectedDay] = useState(["all"]);

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!selectedStudent)
      return setAlert({ title: "Selecciona un alumno", type: "error" });
    if (values.students.find((s) => s.id === selectedStudent.id))
      return setAlert({ title: "El alumno ya fue agregado", type: "error" });

    const stops = [];
    if (selectedDay.includes(ALL_DAY)) {
      Object.keys(DAYS).forEach((day) => {
        stops.push({
          day,
          coords: {
            toHome: temporalToHome,
            toSchool: bothTravels ? temporalToHome : temporalToSchool,
          },
        });
      });
    } else {
      selectedDay.forEach((day) => {
        stops.push({
          day,
          coords: {
            toHome: temporalToHome,
            toSchool: bothTravels ? temporalToHome : temporalToSchool,
          },
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

    setFieldValue("students", [...values.students, studentObj]);
    addStops(studentObj);
  };

  const handleClearStudent = (e) => {
    e.preventDefault();
    setSelectedStudent(null);
    setTemporalToSchool(null);
    setTemporalToHome(null);
    setSelectedDay("all");
    setBothTravels(true);
  };

  const travelName = bothTravels ? "Ambos viajes" : "Viaje a casa";

  return (
    <div className="mb-4 grid grid-rows-2">
      <div className="row-span-1">
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3">
            <div className="mx-2">
              <SelectField
                labelTitle="Día"
                name="day"
                options={DAYS_OPTIONS}
                onChange={(e) => {
                  setSelectedDay(() => {
                    const selected = [];
                    Object.values(e.target.selectedOptions).map((option) => {
                      selected.push(option.value);
                    });
                    if (selected.includes(ALL_DAY)) return [ALL_DAY];
                    return selected;
                  });
                }}
                value={selectedDay}
                multiple
              />
            </div>
            <div className="form-control m-2">
              <label className="label cursor-pointer">
                <span className="label-text">Ambos viajes</span>
                <input
                  type="checkbox"
                  checked={bothTravels}
                  className="checkbox"
                  onChange={(e) => setBothTravels(e.target.checked)}
                />
              </label>
            </div>
            <Autocomplete
              options={allStudents}
              placeholder="Selecciona un alumno"
              onSelect={(value) => {
                const element = allStudents.find(
                  (student) => student.id === value,
                );
                setSelectedStudent(element);
              }}
              name="student"
              value={selectedStudent?.id || null}
            />
            <div className="flex flex-row items-center">
              <PlacesAutocomplete
                label={travelName}
                setPlace={setTemporalToHome}
                place={temporalToHome?.label}
              />
            </div>
            {!bothTravels && (
              <div className="flex flex-row items-center">
                <PlacesAutocomplete
                  label={"A la escuela"}
                  setPlace={setTemporalToSchool}
                  place={temporalToSchool?.label}
                />
              </div>
            )}
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
        {values.students.map((student) => (
          <div key={student.id} className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <div className="flex flex-row items-center">
                <MapPinIcon className="h-4 w-4 text-yellow" />
                <div className="flex ps-2">
                  <span className="text-sm font-semibold">{`${student?.name} ${student?.lastName} ${student?.secondLastName}`}</span>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex justify-end pe-4">
                <ButtonAction
                  onClick={() => {
                    console.log("Editar");
                  }}
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
