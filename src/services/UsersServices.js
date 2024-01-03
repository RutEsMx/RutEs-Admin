import { validateEmail } from "@/utils/functionsClient";
import { createDocument, updateDocument } from "@/firebase/crud";
import { signUp } from "./AuthServices";
import { sendPassword } from "./MailService";

const createUsersByForm = async (data) => {
  // eslint-disable-next-line no-unused-vars
  const { confirmPassword, ...restData } = data;
  const { email, avatar } = restData;

  const avatarFile = avatar instanceof File ? avatar : null;
  let avatarFilename = null;

  if (validateEmail(email)) {
    try {
      if (avatarFile) {
        const dataFile = new FormData();
        dataFile.set("avatar", avatarFile);

        const responseAvatar = await fetch(`/api/images`, {
          method: "POST",
          body: dataFile,
        });
        const avatarData = await responseAvatar.json();
        avatarFilename = avatarData?.result;
      }
      const signUpResult = await signUp(email);
      if (!signUpResult?.error) {
        const uid = signUpResult?.result?.uid;
        const password = restData?.password || signUpResult?.result?.password;
        const profileData = {
          ...restData,
          id: uid,
          password,
          avatar: avatarFilename,
        };
        await createDocument("profile", profileData);
        await sendPassword(email, password, "Cuenta creada");
        return { success: true, message: "Usuario creado correctamente" };
      } else {
        return {
          error: signUpResult?.error,
        };
      }
    } catch (error) {
      return { error };
    }
  } else {
    return { error: "El correo no es valido" };
  }
};

const updateUsersByForm = async (data) => {
  const dataCopy = { ...data };
  const { email, avatar, password } = dataCopy;

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
      if (password !== null) {
        await updatePasswordAuth(dataCopy.id, password);
      }

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
    throw new Error("El correo no es valido");
  }
};

const updatePasswordAuth = async (id, password) => {
  try {
    const userResponse = await fetch(`/api/auth/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
    });

    const response = await userResponse.json();
    if (response.error) throw new Error(response.error.message);
    await sendPassword(response.data.email, password, "Cambio de contraseña");
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const getUsers = async ({ pageIndex, pageSize }) => {
  try {
    const response = await fetch(
      `/api/users?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    );
    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }
    const data = await response.json();

    return data;
  } catch (error) {
    return { error };
  }
};

export { createUsersByForm, getUsers, updateUsersByForm };
