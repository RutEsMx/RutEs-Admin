import { validateEmail } from "@/utils";
import { createDocument, updateDocument } from "@/firebase/crud";
import { signUp } from "./AuthServices";

const createUsersByForm = async (data) => {
  const dataCopy = { ...data };
  const { email, avatar } = dataCopy;

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
        const avatarData = await responseAvatar.json();
        avatarFilename = avatarData?.result;
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
        ...dataCopy,
        id: uid,
        password,
        avatar: avatarFilename,
      };
      await createDocument("profile", profileData);
      return { success: true, message: "Usuario creado correctamente" };
    } catch (error) {
      return { error };
    }
  } else {
    return { error: "El correo no es valido" };
  }
};

const updateUsersByForm = async (data) => {
  const dataCopy = { ...data };
  const { email, avatar } = dataCopy;

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
        if (resultAvatar) dataCopy.avatar = resultAvatar;
      }

      const response = await updateDocument("profile", dataCopy.id, dataCopy);

      if (response?.error) return { error: response.error };
      return {
        success: true,
        message: "Usuario actualizado correctamente",
        result: dataCopy,
      };
    } catch (error) {
      return { error };
    }
  } else {
    return { error: "El correo no es valido" };
  }
};

const getUsers = async ({ pageIndex, pageSize, schoolId }) => {
  try {
    const response = await fetch(
      `/api/users?pageIndex=${pageIndex}&pageSize=${pageSize}&schoolId=${schoolId}`,
    );
    return { success: true, data: response };
  } catch (error) {
    return { error };
  }
};

export { createUsersByForm, getUsers, updateUsersByForm };
