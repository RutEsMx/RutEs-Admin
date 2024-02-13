import { signUp } from "@/services/AuthServices";
import { validateEmail } from "@/utils/functionsClient";
import {
  createDocument,
  getDocumentById,
  updateDocument,
} from "@/firebase/crud";
import {
  getStudentsRoutes,
  setStudent,
  setStudents,
  updateStudent,
} from "@/store/useStudentsStore";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import { CURRENT_DAY, DAYS } from "@/utils/options";
import { setStructureDatatable } from "./TableServices";
import { sendPassword } from "./MailService";

const getStudentById = async (id) => {
  const studentData = await getDocumentById("students", id);
  studentData.id = id;

  const stops = query(collection(db, "stops"), where("student", "==", id));

  const stopsSnapshot = await getDocs(stops);
  if (!stopsSnapshot.empty) {
    const daysOfWeek = Object.keys(DAYS);
    const stops = [];
    const routesArray = new Set();
    stopsSnapshot.forEach((doc) => {
      const stop = doc.data();
      stops.push({ ...stop, id: doc.id });
      routesArray.add(stop.route);
    });
    const routesPromises = Array.from(routesArray).map((route) =>
      getDocumentById("routes", route),
    );
    const routes = await Promise.all(routesPromises);
    studentData.routes = routes;
    studentData.stops = stops.sort((a, b) => {
      return daysOfWeek?.indexOf(a.day) - daysOfWeek?.indexOf(b.day);
    });
  }

  setStudent(studentData);
  return studentData;
};

const createParentProfile = async (parent, schoolId, roles) => {
  if (parent.emailExist) return updateParentProfile(parent);
  const { email, avatar } = parent;
  let avatarFilename = avatar || "";

  if (validateEmail(email)) {
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

      const signUpResult = await signUp(email);
      if (signUpResult?.error) {
        return {
          error: signUpResult.error,
        };
      }

      const uid = signUpResult?.result?.uid;
      const password = signUpResult?.result?.password;

      await sendPassword(email, password, "Cuenta creada");

      const profileData = {
        ...parent,
        id: uid,
        password,
        roles: roles || ["user"],
        schoolId,
        avatar: avatarFilename,
        isFirstTime: roles.find((role) => role === "user") ? true : false,
      };

      const responseCreateDocument = await createDocument(
        "profile",
        profileData,
      );
      return responseCreateDocument;
    } catch (error) {
      return { error };
    }
  }
};

export const updateParentProfile = async (parent) => {
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
    delete parent.isEdit;
    delete parent.emailExist;

    const profileData = {
      ...parent,
      avatar: avatarFilename || null,
    };

    await updateDocument("profile", profileData.id, profileData);
    const userRef = doc(db, "profile", profileData.id);
    return userRef;
  } catch (error) {
    return { error };
  }
};

const createParentsByForm = async (data, schoolId) => {
  const {
    countTutors,
    father,
    mother,
    avatar,
    // eslint-disable-next-line no-unused-vars
    includeMother,
    // eslint-disable-next-line no-unused-vars
    includeFather,
    ...studentData
  } = data;

  const [fatherProfile, motherProfile] = await Promise.all([
    createParentProfile(father, schoolId, ["user"]),
    createParentProfile(mother, schoolId, ["user"]),
  ]);

  if (fatherProfile?.error) {
    throw new Error(`Papá ${fatherProfile.error?.message}`);
  }

  if (motherProfile?.error) {
    throw new Error(`Mamá ${motherProfile.error?.message}`);
  }

  studentData.schoolId = schoolId;

  if (avatar instanceof File) {
    const dataFile = new FormData();
    dataFile.set("avatar", avatar);

    const responseAvatar = await fetch(`/api/images`, {
      method: "POST",
      body: dataFile,
    });

    const { result: resultAvatar } = await responseAvatar.json();
    if (resultAvatar) studentData.avatar = resultAvatar;
  }

  for (let i = 0; i < countTutors; i++) {
    const tutor = `tutors_${i}`;
    delete studentData[tutor];
  }
  studentData.fullName = [
    studentData?.name,
    studentData?.lastName,
    studentData?.secondLastName,
  ];
  const studentProfile = await createDocument("students", studentData);
  if (studentProfile?.error) {
    throw new Error(`Estudiante: ${studentProfile.error?.code}`);
  }
  const tutors = Array.from({ length: countTutors }, (_, i) => {
    const tutor = `tutors_${i}`;
    const tutorData = {
      ...data[tutor],
      schoolId,
      students: [...(data[tutor]?.students ?? []), studentProfile],
    };
    delete studentData[tutor];
    return createParentProfile(tutorData, schoolId, ["tutor"]);
  });

  let responseProfile;
  const parents = [];

  if (fatherProfile?.id) {
    responseProfile = await updateDocument("profile", fatherProfile.id, {
      students: [...(father.students || []), studentProfile],
    });
    if (responseProfile?.error) {
      throw new Error(`Papá: ${responseProfile.error?.code}`);
    }
    parents.push(fatherProfile);
  }
  if (motherProfile?.id) {
    responseProfile = await updateDocument("profile", motherProfile.id, {
      students: [...(mother.students || []), studentProfile],
    });
    if (responseProfile?.error) {
      throw new Error(`Mamá: ${responseProfile.error?.code}`);
    }
    parents.push(motherProfile);
  }

  const tutorProfiles = await Promise.all(tutors);

  if (tutorProfiles.some((profile) => profile?.error)) {
    throw new Error(
      `Tutor: ${tutorProfiles.find((profile) => profile?.error)?.code}`,
    );
  }

  const tutorActive = Array.from({ length: countTutors }, (_, i) => {
    const tutor = `tutors_${i}`;
    if (data[tutor]?.active) {
      return tutorProfiles[i].id;
    }
  }).filter(Boolean);

  const responseUpdateStudent = await updateDocument(
    "students",
    studentProfile.id,
    {
      parents: parents.filter((parent) => parent?.id),
      tutors: tutorProfiles.filter((profile) => profile?.id),
      tutorActive: (tutorActive[0] && tutorActive[0]) || null,
    },
  );

  if (responseUpdateStudent?.error) {
    throw new Error(`Estudiante: ${responseUpdateStudent.error?.code}`);
  }

  return { success: true, message: "Estudiante creado correctamente" };
};

const getStudents = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/students`,
    );
    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }
    const data = await response.json();
    const studentsOptions = await createStudentsTable(data);
    const dataTable = setStructureDatatable(studentsOptions);
    return setStudents(dataTable);
  } catch (error) {
    return { error: error?.message };
  }
};

const getStudentsForRoutes = async () => {
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

const updateStudentByForm = async (data) => {
  const { avatar } = data;
  let avatarFilename = avatar;

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

  data.avatar = avatarFilename;

  data.fullName = [data?.name, data?.lastName, data?.secondLastName];
  const response = await updateDocument("students", data?.id, data);
  if (response?.error) {
    return { error: response.error };
  }
  updateStudent(response);
  return { success: true, message: "Estudiante actualizado correctamente" };
};

const createStudentsOptions = async (students) => {
  students = students.filter((student) => student.status === "active");
  const studentsPromise = students.map(async (student) => {
    const stops = query(
      collection(db, "stops"),
      where("student", "==", student?.id),
    );

    const stopsSnapshot = await getDocs(stops);
    if (!stopsSnapshot.empty) {
      const stopsData = await stopsSnapshot.docs.map((doc) => {
        const stop = doc.data();
        return { ...stop, id: doc.id };
      });
      student.stops = stopsData;
    }

    const { name, lastName, secondLastName } = student;

    const obj = {
      value: student.id,
      label: `${name || ""} ${lastName || ""} ${secondLastName || ""}`,
      ...student,
    };
    return obj;
  });
  return Promise.all(studentsPromise);
};
const createStudentsTable = async (students) => {
  const studentsPromise = students.map(async (student) => {
    const stops = query(
      collection(db, "stops"),
      where("student", "==", student?.id),
    );

    const stopsSnapshot = await getDocs(stops);
    if (!stopsSnapshot.empty) {
      const stopsData = await stopsSnapshot.docs.map((doc) => {
        const stop = doc.data();
        if (stop.day === CURRENT_DAY) {
          return { ...stop, id: doc.id };
        }
      });
      // remove undefined values into stopsData
      student.stops = stopsData.filter((stop) => stop);
    }
    return student;
  });
  return Promise.all(studentsPromise);
};

// const updateTutorsArray = async (studentId, tutorId, status) => {
// }

const createTutorProfile = async (parent, studentId, schoolId, roles) => {
  const { email, avatar } = parent;
  let avatarFilename = avatar || null;

  if (validateEmail(email)) {
    try {
      let responseCreateDocument;
      const studentRef = doc(db, "students", studentId);

      if (parent.emailExist) {
        responseCreateDocument = await updateDocument("profile", parent.id, {
          students: [...(parent.students || []), studentRef],
        });
      } else {
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

        const signUpResult = await signUp(email);
        if (signUpResult?.error) {
          return {
            error: signUpResult.error,
          };
        }

        const uid = signUpResult?.result?.uid;
        const password = signUpResult?.result?.password;

        await sendPassword(email, password, "Cuenta creada");

        const profileData = {
          ...parent,
          id: uid,
          password,
          roles: roles || ["user"],
          schoolId,
          avatar: avatarFilename,
          isFirstTime: roles.find((role) => role === "user") ? true : false,
          students: [studentRef],
        };
        responseCreateDocument = await createDocument("profile", profileData);
      }

      await updateDoc(studentRef, {
        tutors: arrayUnion(responseCreateDocument),
      });

      return;
    } catch (error) {
      return { error };
    }
  }
};

export {
  createParentsByForm,
  getStudentById,
  getStudents,
  getStudentsForRoutes,
  updateStudentByForm,
  createTutorProfile,
};
