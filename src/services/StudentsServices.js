import { signUp } from "@/services/AuthServices";
import { validateEmail } from "@/utils";
import {
  createDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "@/firebase/crud";

const getStudentById = async (id) => {
  const studentData = await getDocumentById("students", id);
  return studentData;
};

const createParentProfile = async (parent, schoolId) => {
  const { email } = parent;

  if (validateEmail(email)) {
    try {
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
        roles: ["user"],
        schoolId,
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
  const dataCopy = { ...data };
  const { father, mother } = dataCopy;

  const fatherProfile = await createParentProfile(father, schoolId);
  if (fatherProfile?.error) {
    throw new Error(`Papá: ${fatherProfile.error?.code}`);
  }

  const motherProfile = await createParentProfile(mother, schoolId);
  if (motherProfile?.error) {
    throw new Error(`Mamá: ${motherProfile.error?.code}`);
  }

  delete dataCopy.countTutors;
  delete dataCopy.father;
  delete dataCopy.mother;
  delete dataCopy.includeFather;
  delete dataCopy.includeMother;
  dataCopy.schoolId = schoolId;

  const studentProfile = await createDocument("students", dataCopy);
  if (studentProfile?.error) {
    throw new Error(`Estudiante: ${studentProfile.error?.code}`);
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
    { parents: parents },
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

export { createParentsByForm, getStudentById, getStudents };
