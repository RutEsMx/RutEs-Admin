import Autocomplete from "@/components/Autocomplete";
import InputField from "@/components/InputField";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import { useStudentsStore } from "@/store/useStudentsStore";
import { useFormikContext } from "formik";
import { memo } from "react";
import { MapPinIcon, PlusIcon } from "@heroicons/react/24/solid";
import ButtonAction from "@/components/Table/elements/ButtonAction";

const StepStops = () => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();
  console.log("🚀 ~ file: index.jsx:12 ~ StepStops ~ values:", values)
  const { allStudents } = useStudentsStore();
  
  return (
    <div className="mb-4 grid grid-rows-2">
      <div className="row-span-1">
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3">
            <div className="flex flex-row items-center">
              {/* <MapPinIcon className="h-6 w-6 text-black" /> */}
              <PlacesAutocomplete />
            </div>
            <Autocomplete
              options={allStudents}
              placeholder="Selecciona un alumno"
              onSelect={(value) => setFieldValue("student", value)}
              error={errors.student}
              value={values.student}
              name="student"
            />
          </div>
          <div className="col-span-1">
            <div className="flex flex-row items-center h-full">
              <ButtonAction
                onClick={() => console.log("click")}
                disabled={false}
              >
                <PlusIcon className="h-6 w-6 text-black" />
              </ButtonAction>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-2">
        Lista de alumnos agregados
      </div>
    </div>
  );
};

const MemoStepStops = memo(StepStops);

export default MemoStepStops;
