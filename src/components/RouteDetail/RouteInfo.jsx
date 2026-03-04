"use client";

import { Label } from "@/components/ui/label";
import DayTypePicker from "@/components/DayTypePicker";

const RouteInfo = ({
  route,
  travelData,
  selectedDay,
  typeTravel,
  isWorkshop,
  onDayChange,
  onTypeChange,
  listStudents,
  onStudentClick,
}) => {
  return (
    <div className="flex flex-col justify-around">
      <span className="font-bold text-xl mb-4">{route?.name}</span>

      <div className="flex flex-row gap-2">
        <span className="font-semibold">Capacidad:</span>
        <span>{route?.capacity}</span>
      </div>

      <div className="flex flex-row gap-2">
        <span className="font-semibold">Estado:</span>
        <StatusBadge status={route?.status} />
      </div>

      <div className="mt-4 pb-2 border-b-2">
        <DayTypePicker
          students={travelData}
          selectedDay={selectedDay}
          typeTravel={typeTravel}
          onDayChange={onDayChange}
          onTypeChange={onTypeChange}
          isWorkshop={isWorkshop}
        />
      </div>

      <div className="flex flex-row gap-2 pt-4 mt-2 border-t-2">
        <Label className="text-lg font-semibold">Estudiantes</Label>
      </div>

      <div className="flex flex-col gap-2 mt-2 border-t-2 pt-2">
        <StudentListDisplay
          students={listStudents}
          onStudentClick={onStudentClick}
        />
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      label: "Activo",
      className: "bg-green-100 text-green-800 px-2 py-1 rounded",
    },
    inactive: {
      label: "Inactivo",
      className: "bg-red-100 text-red-800 px-2 py-1 rounded",
    },
  };

  const config = statusConfig[status] || {
    label: "Desconocido",
    className: "bg-gray-100 text-gray-800 px-2 py-1 rounded",
  };

  return (
    <span
      className={config.className}
      role="status"
      aria-label={`Estado: ${config.label}`}
    >
      {config.label}
    </span>
  );
};

const StudentListDisplay = ({ students, onStudentClick }) => {
  if (!students || students.length === 0) {
    return (
      <span className="text-muted-foreground text-sm italic">
        No hay estudiantes asignados
      </span>
    );
  }

  return (
    <ul className="space-y-1" role="list" aria-label="Lista de estudiantes">
      {students.map((student) => (
        <li key={student.id}>
          <button
            onClick={() => onStudentClick(student)}
            className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={`Ver ubicación de ${student.name} ${student.lastName}`}
          >
            {student.name} {student.lastName} {student.secondLastName}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default RouteInfo;
