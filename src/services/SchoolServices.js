import { validateEmail } from "@/utils"
import { createDocument, getDocumentById, getDocuments, updateDocument } from "@/firebase/crud"

const createSchoolByForm = async (data) => {
  const dataCopy = { ...data };
  const { email } = dataCopy;

  if(validateEmail(email)) {
    try {
      const response = await createDocument("schools", dataCopy)
      if(response.error) return { error: response.error }
      return { success: true, message: "Escuela creada correctamente" };
    } catch (error) {
      return { error };
    }
  } else {
    return { error: "El correo no es valido" };
  }
};

export {
  createSchoolByForm,
}
