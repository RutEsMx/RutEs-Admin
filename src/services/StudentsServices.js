import { setStudents, useStudentsStore } from "@/store/useStudentsStore";
import { setStructureDatatable } from "./TableServices";
import { getDocumentById, getDocumentByField } from "@/firebase/crud";
import { onSnapshot, collection, query, where, doc } from "firebase/firestore";
import { db } from "@/firebase/client";

const getStudents = async () => {
  const setLoading = useStudentsStore.getState().setLoading;

  try {
    setLoading(true); // activa loader

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/students`,
    );

    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }

    const data = await response.json();
    const dataTable = setStructureDatatable(data);
    setStudents(dataTable); // guarda los datos procesados

    return true;
  } catch (error) {
    return { error: error?.message };
  } finally {
    setLoading(false); // desactiva loader
  }
};
const deleteStudents = async (ids) => {
  try {
    const response = await fetch(`/api/students`, {
      method: "DELETE",
      body: JSON.stringify(ids),
    });

    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error?.message };
  }
};

const getStudentById = async (id) => {
  const setLoading = useStudentsStore.getState().setLoading;
  const setStudent = useStudentsStore.getState().setStudent;

  try {
    setLoading(true);
    const student = await getDocumentById("students", id);
    if (!student) return { error: "Estudiante no encontrado" };

    // Obtener paradas del estudiante
    const stops = await getDocumentByField("stops", "student", id);
    student.stops = stops || [];
    student.id = id;

    setStudent(student);
    return student;
  } catch (error) {
    return { error: error?.message };
  } finally {
    setLoading(false);
  }
};

const subscribeStudents = (schoolId) => {
  if (!schoolId) return;

  const setLoading = useStudentsStore.getState().setLoading;

  const q = query(
    collection(db, "students"),
    where("schoolId", "==", schoolId),
    where("isDeleted", "==", false),
  );

  setLoading(true);
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const students = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const dataTable = setStructureDatatable(students);
      setStudents(dataTable);
      setLoading(false);
    },
    (error) => {
      console.error("Error subscribing to students:", error);
      setLoading(false);
    },
  );

  return unsubscribe;
};

const subscribeStudentById = (id) => {
  if (!id) return;

  const setLoading = useStudentsStore.getState().setLoading;
  const setStudent = useStudentsStore.getState().setStudent;

  setLoading(true);
  const unsubscribe = onSnapshot(
    doc(db, "students", id),
    async (docSnap) => {
      if (docSnap.exists()) {
        const student = { id: docSnap.id, ...docSnap.data() };

        // We still might need to get stops manually or subscribe to them
        // For now, let's just update the student data
        const stops = await getDocumentByField("stops", "student", id);
        student.stops = stops || [];

        setStudent(student);
      }
      setLoading(false);
    },
    (error) => {
      console.error("Error subscribing to student:", error);
      setLoading(false);
    },
  );

  return unsubscribe;
};

export {
  getStudents,
  deleteStudents,
  getStudentById,
  subscribeStudents,
  subscribeStudentById,
};
