import {signUp} from "@/firebase/auth"
import { generatePassword, validateEmail } from "@/utils"
import { createDocument, getDocumentById, getDocuments, updateDocument } from "@/firebase/crud"

const getStudentById = async(id) => {
  console.log("🚀 ~ file: studentsServices.js:12 ~ getStudentById ~ id:", id)
  const studentData = await getDocumentById('students', id)
  console.log("🚀 ~ file: studentsServices.js:14 ~ getStudentById ~ studentData", studentData)
  return studentData
}

const createParentProfile = async (parent) => {
  const { email } = parent;
  const password = generatePassword();

  if (validateEmail(email)) {
    try {
      const signUpResult = await signUp(email, password);
      if (signUpResult?.error) {
        return {
          error: signUpResult.error
        }
      }
      const uid = signUpResult?.result?.user?.uid;

      const profileData = {
        ...parent,
        id: uid,
        password,
        roles: ["user"],
      };

      const responseCreateDocument = await createDocument('profile', profileData);
      return responseCreateDocument

    } catch (error) {
      return { error };
    }
  }
};

const createParentsByForm = async (data) => {
  const dataCopy = { ...data };
  const { father, mother } = dataCopy;
  
  const fatherProfile = await createParentProfile(father);
  if (fatherProfile?.error) {
    throw new Error(`Papá: ${fatherProfile.error?.code}`);
  }
  
  const motherProfile = await createParentProfile(mother);
  if (motherProfile?.error) {
    throw new Error(`Mamá: ${motherProfile.error?.code}`);
  }

  delete dataCopy.countTutors;
  delete dataCopy.father;
  delete dataCopy.mother;
  delete dataCopy.includeFather;
  delete dataCopy.includeMother;
  

  const studentProfile = await createDocument('students', dataCopy);
  if (studentProfile?.error) {
    throw new Error(`Estudiante: ${studentProfile.error?.code}`);
  }
  
  let responseProfile
  const parents = []

  if (fatherProfile?.id) {
    responseProfile = await updateDocument('profile', fatherProfile.id, { students: [studentProfile] });
    if (responseProfile?.error) {
      throw new Error(`Papá: ${responseProfile.error?.code}`);
    }
    parents.push(fatherProfile)
  }
  if (motherProfile?.id) {
    responseProfile = await updateDocument('profile', motherProfile.id, { students: [studentProfile] });
    if (responseProfile?.error) {
      throw new Error(`Mamá: ${responseProfile.error?.code}`);
    }
    parents.push(motherProfile)
  }
  const responseUpdateStudent = await updateDocument('students', studentProfile.id, { parents: parents });
  if (responseUpdateStudent?.error) {
    throw new Error(`Estudiante: ${responseUpdateStudent.error?.code}`);
  }

  return { success: true, message: "Estudiante creado correctamente" };
};

const getStudents = async (school) => {
  console.log("🚀 ~ file: StudentsServices.js:104 ~ getStudents ~ students:")
  const students = await getDocuments('students', school)
  return students
}

export {
  createParentsByForm,
  getStudentById,
  getStudents,
}
