import { createDocument, updateDocument } from "@/firebase/crud";
import { setAllDrivers } from "@/store/useDriversStore";

const createDriverByForm = async (data) => {
  const dataCopy = { ...data };
  const { avatar } = dataCopy;
  let avatarFilename = avatar;

  try {
    if (avatar instanceof File) {
      const dataFile = new FormData();
      dataFile.set("avatar", avatar);
      dataFile.set("type", "drivers");

      const responseAvatar = await fetch(`/api/images`, {
        method: "POST",
        body: dataFile,
      });
      const avatarData = await responseAvatar.json();
      avatarFilename = avatarData?.result;
    }
    dataCopy.avatar = avatarFilename;
    const response = await createDocument("drivers", dataCopy);
    if (response?.error) return { error: response.error };
    return { success: true, message: "Conductor creado correctamente" };
  } catch (error) {
    return { error };
  }
};

const updateDriverByForm = async (data) => {
  const dataCopy = { ...data };
  const { avatar } = dataCopy;

  try {
    if (avatar instanceof File) {
      const dataFile = new FormData();
      dataFile.set("avatar", avatar);
      dataFile.set("type", "drivers");

      const responseAvatar = await fetch(`/api/images`, {
        method: "POST",
        body: dataFile,
      });

      const { result: resultAvatar } = await responseAvatar.json();
      if (resultAvatar) dataCopy.avatar = resultAvatar;
    }

    const response = await updateDocument("drivers", dataCopy.id, dataCopy);

    if (response?.error) return { error: response.error };
    return {
      success: true,
      message: "Conductor actualizado correctamente",
      result: dataCopy,
    };
  } catch (error) {
    return { error };
  }
};

const getDriver = async ({ pageIndex, pageSize, schoolId }) => {
  try {
    const response = await fetch(
      `/api/drivers?pageIndex=${pageIndex}&pageSize=${pageSize}&schoolId=${schoolId}`,
    );
    return { success: true, data: response };
  } catch (error) {
    return { error };
  }
};

const getAllDrivers = async ({ all = false }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/drivers?all=${all}`,
    );

    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }
    const data = await response.json();
    setAllDrivers(data);
    return data;
  } catch (error) {
    return { error: error.message };
  }
};

export { createDriverByForm, updateDriverByForm, getDriver, getAllDrivers };
