import { signUp } from "@/services/AuthServices";
import { validateEmail } from "@/utils";
import {
  createDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "@/firebase/crud";
import { setAllStudents } from "@/store/useStudentsStore";

const getStudentById = async (id) => {
  const studentData = await getDocumentById("students", id);
  return studentData;
};

const createParentProfile = async (parent, schoolId, roles) => {
  const { email, avatar } = parent;
  let avatarFilename = avatar;

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

      const profileData = {
        ...parent,
        id: uid,
        password,
        roles: roles || ["user"],
        schoolId,
        avatar: avatarFilename,
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

const createParentsByForm = async (data, schoolId) => {
  const { countTutors } = data;
  const dataCopy = { ...data };
  const studentData = { ...dataCopy };
  const { father, mother, avatar } = dataCopy;
  const tutors = [];

  const fatherProfile = await createParentProfile(father, schoolId, ["user"]);
  if (fatherProfile?.error) {
    throw new Error(`Papá: ${fatherProfile.error?.code}`);
  }

  const motherProfile = await createParentProfile(mother, schoolId, ["user"]);
  if (motherProfile?.error) {
    throw new Error(`Mamá: ${motherProfile.error?.message}`);
  }
  delete studentData.countTutors;
  delete studentData.father;
  delete studentData.mother;
  delete studentData.includeFather;
  delete studentData.includeMother;
  studentData.schoolId = schoolId;
  dataCopy.schoolId = schoolId;

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

  const studentProfile = await createDocument("students", studentData);
  if (studentProfile?.error) {
    throw new Error(`Estudiante: ${studentProfile.error?.code}`);
  }

  for (let i = 0; i < countTutors; i++) {
    const tutor = `tutors_${i}`;
    const tutorData = dataCopy[tutor];
    tutorData.schoolId = schoolId;
    tutorData.students = [studentProfile];
    const responseTutor = await createParentProfile(tutorData, schoolId, [
      "tutor",
    ]);
    if (responseTutor?.error) {
      throw new Error(`Papá: ${responseTutor.error?.code}`);
    }

    delete dataCopy[tutor];
    tutors.push(responseTutor);
  }

  let responseProfile;
  const parents = [];

  if (fatherProfile?.id) {
    responseProfile = await updateDocument("profile", fatherProfile.id, {
      students: [studentProfile],
    });
    if (responseProfile?.error) {
      throw new Error(`Papá: ${responseProfile.error?.code}`);
    }
    parents.push(fatherProfile);
  }
  if (motherProfile?.id) {
    responseProfile = await updateDocument("profile", motherProfile.id, {
      students: [studentProfile],
    });
    if (responseProfile?.error) {
      throw new Error(`Mamá: ${responseProfile.error?.code}`);
    }
    parents.push(motherProfile);
  }
  const responseUpdateStudent = await updateDocument(
    "students",
    studentProfile.id,
    {
      parents: parents,
      tutors: tutors,
    },
  );
  if (responseUpdateStudent?.error) {
    throw new Error(`Estudiante: ${responseUpdateStudent.error?.code}`);
  }

  return { success: true, message: "Estudiante creado correctamente" };
};

const getStudents = async (school) => {
  const students = await getDocuments("students", school);
  return students;
};

const getAllStudents = async ({ all = false }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/students?all=${all}`,
    );

    if (response?.redirected) {
      return {
        error: true,
        redirect: response.url,
        message: "Redireccionando",
      };
    }
    const data = await response.json();
    setAllStudents(data);
    return data;
  } catch (error) {
    return { error: error.message };
  }
};

export { createParentsByForm, getStudentById, getStudents, getAllStudents };
