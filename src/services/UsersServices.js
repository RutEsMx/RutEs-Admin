import {signUp} from "@/firebase/auth"
import { generatePassword, validateEmail } from "@/utils"
import { createDocument, getDocumentById, getDocuments, updateDocument } from "@/firebase/crud"

const createUsersByForm = async (data) => {
  const dataCopy = { ...data };
  const { email } = dataCopy;
  const password = generatePassword();

  if(validateEmail(email)) {
    try {
      const signUpResult = await signUp(email, password);
      if (signUpResult?.error) {
        return {
          error: signUpResult.error
        }
      }
      const uid = signUpResult?.result?.user?.uid;
      const profileData = {
        ...dataCopy,
        id: uid,
        password,
      };
      await createDocument("profile", profileData)
      return { success: true, message: "Usuario creado correctamente" };
    } catch (error) {
      return { error };
    }
  } else {
    return { error: "El correo no es valido" };
  }
};



export {
  createUsersByForm,
}
