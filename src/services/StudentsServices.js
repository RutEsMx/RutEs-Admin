import { setStudents, useStudentsStore } from "@/store/useStudentsStore";
import { setStructureDatatable } from "./TableServices";
import {
  getDocumentById,
  getDocumentByField,
  updateDocument,
} from "@/firebase/crud";
import {
  onSnapshot,
  collection,
  query,
  where,
  doc,
  getDocs,
} from "firebase/firestore";
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

  // Nota: NO filtramos por isDeleted == false porque en Firestore ese operador
  // excluye documentos donde el campo no existe (undefined/missing).
  // En cambio filtramos isDeleted === true en JavaScript después de obtener los docs.
  const q = query(
    collection(db, "students"),
    where("schoolId", "==", schoolId),
  );

  // Solo mostrar skeleton si aún no hay datos en el store
  const hasData = (useStudentsStore.getState().students?.rows?.length ?? 0) > 0;
  if (!hasData) setLoading(true);

  // Token de cancelación: descarta resultados de fetches obsoletos
  // cuando onSnapshot dispara múltiples veces (caché local + servidor)
  let fetchToken = 0;

  const unsubscribe = onSnapshot(
    q,
    async (snapshot) => {
      const currentToken = ++fetchToken;

      const students = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        // Excluir solo los marcados explícitamente como eliminados
        .filter((s) => s.isDeleted !== true);

      let studentsWithStops = students;

      try {
        // Fetch stops for all students in batches (Firestore 'in' limit is 30)
        const studentIds = students.map((s) => s.id);
        const allStops = [];

        for (let i = 0; i < studentIds.length; i += 30) {
          const chunk = studentIds.slice(i, i + 30);
          const stopsQuery = query(
            collection(db, "stops"),
            where("student", "in", chunk),
          );
          const stopsSnapshot = await getDocs(stopsQuery);
          stopsSnapshot.docs.forEach((doc) => {
            allStops.push({ id: doc.id, ...doc.data() });
          });
        }

        // Verificar que no llegó un snapshot más nuevo mientras fetcheábamos
        if (currentToken !== fetchToken) return;

        // Group stops by student ID and attach to each student
        const stopsByStudent = allStops.reduce((acc, stop) => {
          const sid = stop.student;
          if (!acc[sid]) acc[sid] = [];
          acc[sid].push(stop);
          return acc;
        }, {});

        studentsWithStops = students.map((student) => ({
          ...student,
          stops: stopsByStudent[student.id] || [],
        }));
      } catch (error) {
        console.error("Error fetching stops for students:", error);
        // Si hubo error y este ya no es el fetch más reciente, ignorar
        if (currentToken !== fetchToken) return;
      }

      const dataTable = setStructureDatatable(studentsWithStops);
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
};

const createStudentsOptions = async (students) => {
  const studentsPromise = students.map(async (student) => {
    // Consultar la colección stops donde student == id del alumno
    const stopsQuery = query(
      collection(db, "stops"),
      where("student", "==", student.id),
    );
    const stopsSnap = await getDocs(stopsQuery);
    const stops = stopsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return {
      id: student.id,
      value: student.id,
      label: `${student?.name || ""} ${student?.lastName || ""} ${
        student?.secondLastName || ""
      }`,
      stops,
      serviceType: student?.serviceType,
      name: student?.name || "",
      lastName: student?.lastName || "",
      secondLastName: student?.secondLastName || "",
      address: student?.address || null,
    };
  });
  return Promise.all(studentsPromise);
};

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
