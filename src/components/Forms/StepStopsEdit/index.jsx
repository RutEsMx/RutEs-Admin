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
import SelectAutocomplete from "@/components/SelectAutocomplete";
import { useEffect } from "react";

const ALL_DAY = "all";
const SELECT_DAY = DAYS_OPTIONS.slice(1);

const StepStopsEdit = () => {
  const { values, setFieldValue } = useFormikContext();
  const navigation = useRouter();
  const { selectedDayEdit, setSelectedDayEdit } = useRoutesStore();
  const [typeTravel, setTypeTravel] = useState("toHome");
  const [studentsData, setStudentsData] = useState(values?.students?.[selectedDayEdit]?.[typeTravel] || []);
  const [selectedStudentToRemove, setSelectedStudentToRemove] = useState(null);
  useEffect(() => {
    setStudentsData(values?.students?.[selectedDayEdit]?.[typeTravel] || []);
  }, [selectedDayEdit, typeTravel, values?.students]);
  
  const [selectedDay, setSelectedDay] = useState(["all"]);
  const [bothTravels, setBothTravels] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditStudent, setIsEditStudent] = useState(false);

  

  const handleRemoveStudent = (e) => {
    e.preventDefault();
    const students = values?.students?.[selectedDayEdit]?.[typeTravel] || [];
    const newStudents = students.filter((s) => s.id !== selectedStudentToRemove.id);
    setStudentsData(newStudents);
    setFieldValue(`students.${selectedDayEdit}.${typeTravel}`, newStudents);
    const modal = document.getElementById("my_modal_1");
    modal.close();
  };
  
  const handleRemoveStudentAll = (e) => {
    e.preventDefault();
    const students = values?.students || {};
    const newStudents = Object.keys(students).reduce((acc, day) => {
      const newStudents = students[day][typeTravel].filter((s) => s.id !== selectedStudentToRemove.id);
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
  }
  
  const openDeleteModal = (e, student) => {
    e.preventDefault();
    setSelectedStudentToRemove(student);
    const modal = document.getElementById("my_modal_1");
    modal.showModal();
  }
  
  const handleEditStudent = (e, student) => {
    e.preventDefault();
    return navigation.push(`/dashboard/students/edit/${student.id}`);
  }

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

  const handleClearStudent = (e) => {
    e.preventDefault();
    setSelectedStudent(null);
    setFieldValue("temporalToHome", null);
    setFieldValue("temporalToSchool", null);
    setSelectedDay("all");
    setBothTravels(true);
    setIsEditStudent(false);
  };
  
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!selectedStudent)
      return setAlert({
        message: "Selecciona un alumno",
        type: "error",
        show: true,
      });

    // if (values?.students.find((s) => s.id === selectedStudent.id) && !isEditStudent) {
    //   const stops = values?.students.find((s) => s.id === selectedStudent.id).stops;
    //   if (stops.find((stop) => selectedDay.includes(stop.day))) {
    //     return setAlert({
    //       message: "El alumno ya fue agregado",
    //       type: "error",
    //       show: true,
    //     });
    //   }
    // }
    
    const students = values?.students || {};
    
    const stops = [];
    const studentObj = {
      id: selectedStudent?.id,
      name: selectedStudent?.name,
      lastName: selectedStudent?.lastName,
      secondLastName: selectedStudent?.secondLastName,
      // stops,
    };
    if (selectedDay.includes(ALL_DAY)) {
      
      Object.keys(DAYS).forEach((day) => {
        // si bothTravels hay que agregar a ambos viajes
        // si no hay que agregar solo al viaje seleccionado
        if (bothTravels) {
          students[day] = {
            ...students[day],
            toHome: [...students[day].toHome, studentObj],
            toSchool: [...students[day].toSchool, studentObj],
          };
        } else {
          students[day] = {
            ...students[day],
            toHome: values?.temporalToHome ? [...students[day].toHome, studentObj] : students[day].toHome,
            toSchool: values?.temporalToSchool ? [...students[day].toSchool, studentObj] : students[day].toSchool,
          };
        }
          
        
      //   stops.push({
      //     day,
      //     coords: {
      //       toHome: values?.temporalToHome || null,
      //       toSchool: bothTravels
      //         ? values?.temporalToHome || null
      //         : values?.temporalToSchool || null,
      //     },
      //     isDelete: false,
      //     route: values.routeId,
      //   });
      });
    } else {
      selectedDay.forEach((day) => {
        if (bothTravels) {
          students[day] = {
            ...students[day],
            toHome: [...students[day].toHome, studentObj],
            toSchool: [...students[day].toSchool, studentObj],
          };
        } else {
          students[day] = {
            ...students[day],
            toHome: values?.temporalToHome ? [...students[day].toHome, studentObj] : students[day].toHome,
            toSchool: values?.temporalToSchool ? [...students[day].toSchool, studentObj] : students[day].toSchool,
          };
        }
        
      //   stops.push({
      //     day,
      //     coords: {
      //       toHome: values?.temporalToHome || null,
      //       toSchool: bothTravels
      //         ? values?.temporalToHome || null
      //         : values?.temporalToSchool || null,
      //     },
      //     isDelete: false,
      //     route: values.routeId,
      //   });
      });
    }

    // 
    setFieldValue("students", students);
    setStudentsData([...studentsData, studentObj]);
    setAlert({ message: "", type: "", show: false });
    setFieldValue("temporalToHome", null);
    setFieldValue("temporalToSchool", null);
    setSelectedDay("all");
    // if (isEditStudent) {
    //   setFieldValue(
    //     "students",
    //     values.students.map((s) => (s.id === studentObj.id ? studentObj : s)),
    //   );
    // } else {
    //   setFieldValue("students", [...values.students, studentObj]);
    // }
    setSelectedStudent(null);
    setIsEditStudent(false);
  }
  

  return (
    <div className="mb-4 grid grid-rows-1">
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

        {studentsData?.map((student) => (
          <div key={student.id} className="grid grid-cols-3 gap-2 my-2">
            <div className="col-span-2">
              <div className="flex flex-row items-center">
                <MapPinIcon className="h-4 w-4 text-yellow" />
                <div className="flex ps-2">
                  <span className="text-sm font-semibold">{`${student?.name || ''} ${student?.lastName || ''} ${student?.secondLastName || ''}`}</span>
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
          <p className="py-4">Deseas eliminar todos los dias?</p>
          <div className="modal-action">
            <ButtonAction color="bg-light-gray" onClick={handleRemoveStudentAll}>Todos</ButtonAction>
            <ButtonAction onClick={handleRemoveStudent}>{`Solo ${DAYS[selectedDayEdit]}`}</ButtonAction>
          </div>
        </div>
      </dialog>
    </div>
  );
};

const MemoStepStopsEdit = memo(StepStopsEdit);

export default MemoStepStopsEdit;
