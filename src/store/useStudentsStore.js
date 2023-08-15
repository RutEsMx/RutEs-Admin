import { create } from "zustand";

export const useStudentsStore = create((set) => ({
  students: [],
  allStudents: [],
  setStudents: (students) => set({ students }),
  addStudents: (student) =>
    set((state) => ({
      students: {
        ...state.students,
        rows: [...state.students.rows, student],
      },
    })),
  removeStudents: (studentId) =>
    set((state) => ({
      students: {
        ...state.students,
        rows: state.students.rows.filter((student) => student.id !== studentId),
      },
    })),
  updateStudents: (studentId, data) =>
    set((state) => ({
      students: {
        ...state.students,
        rows: state.students.rows.map((student) =>
          student.id === studentId ? { ...student, ...data } : student,
        ),
      },
    })),
  getStudent: (studentId) =>
    set((state) => state.students.rows.find((student) => student.id === studentId)),
  setAllStudents: (allStudents) => set({ allStudents }),
}));

const setStudents = useStudentsStore.getState().setStudents;
const getStudent = useStudentsStore.getState().getStudent;
const addStudents = useStudentsStore.getState().addStudents;
const updateStudents = useStudentsStore.getState().updateStudents;
const removeStudents = useStudentsStore.getState().removeStudents;
const setAllStudents = useStudentsStore.getState().setAllStudents;

export {
  setStudents,
  getStudent,
  addStudents,
  updateStudents,
  removeStudents,
  setAllStudents,
};
