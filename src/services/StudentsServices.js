import { setStudents, useStudentsStore } from "@/store/useStudentsStore";
import { setStructureDatatable } from "./TableServices";
import {
  getDocumentById,
  getDocumentByField,
  updateDocument,
} from "@/firebase/crud";
import { onSnapshot, collection, query, where, doc, getDocs } from "firebase/firestore";
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

const updateParentProfile = async (parent) => {
  const { avatar } = parent;
  let avatarFilename = avatar;

  try {
    if (avatar instanceof File) {
      const dataFile = new FormData();
      dataFile.set("avatar", avatar);
      const responseAvatar = await fetch(`/api/images`, {
        method: "POST",
        body: dataFile,
      });

      const { result: resultAvatar } = await responseAvatar.json();
      if (resultAvatar) avatarFilename = resultAvatar;
    }

    const profileData = {
      ...parent,
      avatar: avatarFilename,
    };

    await updateDocument("profile", profileData.id, profileData);
    const userRef = doc(db, "profile", profileData.id);
    return userRef;
  } catch (error) {
    return { error };
  }
};

const createTutorProfile = async (parent, studentId, schoolId, roles) => {
  if (parent.emailExist) return updateParentProfile(parent);
  const { avatar } = parent;
  let avatarFilename = avatar;

  try {
    if (avatar instanceof File) {
      const dataFile = new FormData();
      dataFile.set("avatar", avatar);
      const responseAvatar = await fetch(`/api/images`, {
        method: "POST",
        body: dataFile,
      });

      const { result: resultAvatar } = await responseAvatar.json();
      if (resultAvatar) avatarFilename = resultAvatar;
    }

    const parentProfile = {
      ...parent,
      students: [doc(db, `students/${studentId}`)],
      schoolId,
      roles,
      avatar: avatarFilename,
    };

    const response = await fetch("/api/auth/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parentProfile),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error);
    }
    return result;
  } catch (error) {
    return { error };
  }
};

const createParentsByForm = async (data, schoolId) => {
  try {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, schoolId }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.error || "Ocurrió un error al crear el estudiante",
      );
    }
    return result;
  } catch (error) {
    return { error };
  }
};

const updateStudentByForm = async (data) => {
  try {
    const { updateStudent } = useStudentsStore.getState();
    data.fullName = [
      data?.name?.toLowerCase(),
      data?.lastName?.toLowerCase(),
      data?.secondLastName?.toLowerCase(),
    ].filter(Boolean);

    const response = await updateDocument("students", data?.id, data);
    if (response?.error) {
      return { error: response.error };
    }
    updateStudent(data);
    return { success: true, message: "Estudiante actualizado correctamente" };
  } catch (error) {
    return { error: error?.message || "Error al actualizar estudiante" };
  }
};

const getStudentsForRoutes = async () => {
  const { getStudentsRoutes } = useStudentsStore.getState();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/students`,
    );

    const data = await response.json();
    const studentsOptions = await createStudentsOptions(data);
    getStudentsRoutes(studentsOptions);
  } catch (error) {
    return { error: error?.message };
  }
}

const createStudentsOptions = async (students) => {
  const studentsPromise = students.map(async (student) => {
    // Consultar la colección stops donde student == id del alumno
    const stopsQuery = query(
      collection(db, "stops"),
      where("student", "==", student.id)
    );
    const stopsSnap = await getDocs(stopsQuery);
    const stops = stopsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return {
      id: student.id,
      value: student.id,
      label: `${student?.name || ''} ${student?.lastName || ''} ${student?.secondLastName || ''}`,
      stops,
      serviceType: student?.serviceType,
      name: student?.name || '',
      lastName: student?.lastName || '',
      secondLastName: student?.secondLastName || '',
      address: student?.address || null,
    };
  });
  return Promise.all(studentsPromise);
}


export {
  getStudents,
  deleteStudents,
  getStudentById,
  subscribeStudents,
  subscribeStudentById,
  createParentsByForm,
  updateStudentByForm,
  updateParentProfile,
  createTutorProfile,
  getStudentsForRoutes,
};
