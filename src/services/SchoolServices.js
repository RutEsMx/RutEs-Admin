import { validateEmail } from "@/utils"
import { createDocument, getDocumentById, getDocuments, updateDocument } from "@/firebase/crud"
import { signOut } from "@/firebase/auth";

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

const getSchooldById = async (id) => {
  try {
    const response = await getDocumentById("schools", id)
    if(response.error) return { error: response.error }
    return { success: true, data: response };
  } catch (error) {
    signOut()
    error.message = "No se pudo obtener datos de la escuela"
    return { error };
  }
};

export {
  createSchoolByForm,
  getSchooldById,
}
