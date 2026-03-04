"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const StudentList = ({ students, onStudentClick }) => {
  if (!students || students.length === 0) {
    return (
      <span className="text-muted-foreground text-sm italic">
        No hay estudiantes asignados
      </span>
    );
  }

  return (
    <ul className="space-y-2">
      {students.map((student) => (
        <li key={student.id}>
          <button
            onClick={() => onStudentClick(student)}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="text-sm">
              {student.name} {student.lastName} {student.secondLastName}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default StudentList;
