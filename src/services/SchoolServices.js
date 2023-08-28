import { validateEmail } from "@/utils/functionsClient";
import {
  createDocument,
  getDocumentById,
  updateDocument,
} from "@/firebase/crud";
import { signOut } from "@/firebase/auth";
import { downloadURL } from "@/utils/functionsClient";

const createSchoolByForm = async (data) => {
  const { logo, ...restData } = data;

  const logoFile = logo instanceof File;
  let logoFilename = null;

  if (validateEmail(data?.email)) {
    try {
      if (logoFile) {
        const dataFile = new FormData();
        dataFile.set("avatar", logo);
        dataFile.set("type", "schools");
        const responseLogo = await fetch(`/api/images`, {
          method: "POST",
          body: dataFile,
        });
        const logoData = await responseLogo.json();
        logoFilename = logoData?.result;
        restData.logo = logoFilename;
      }
      const response = await createDocument("schools", restData);
      if (response?.error) return { error: response.error };
      return { success: true, message: "Escuela creada correctamente" };
    } catch (error) {
      return { error };
    }
  } else {
    return { error: "El correo no es valido" };
  }
};

const updateSchoolByForm = async (data) => {
  const { logo, ...restData } = data;

  const logoFile = logo instanceof File;
  let logoFilename = logoFile ? null : logo;

  if (validateEmail(data?.email)) {
    try {
      if (logoFile) {
        const dataFile = new FormData();
        dataFile.set("avatar", logo);
        dataFile.set("type", "schools");

        const responseLogo = await fetch(`/api/images`, {
          method: "POST",
          body: dataFile,
        });
        const logoData = await responseLogo.json();
        logoFilename = logoData?.result;
      }
      restData.logo = logoFilename;
      const response = await updateDocument("schools", restData.id, restData);

      if (response?.error) return { error: response.error };
      return {
        success: true,
        message: "Escuela actualizada correctamente",
        result: restData,
      };
    } catch (error) {
      return { error };
    }
  } else {
    return { error: "El correo no es valido" };
  }
};

const getSchooldById = async (id) => {
  try {
    const response = await getDocumentById("schools", id);
    if (response?.error) return { error: response.error };
    if (typeof response?.logo === "string") {
      const logoResponse = await downloadURL(response?.logo);
      response.logo = logoResponse;
    }
    return { success: true, data: response };
  } catch (error) {
    signOut();
    error.message = "No se pudo obtener datos de la escuela";
    return { error };
  }
};

const getSchools = async ({ pageIndex, pageSize }) => {
  try {
    const response = await fetch(
      `/api/schools?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      { cache: "no-store" },
    );
    return { success: true, data: response };
  } catch (error) {
    return { error };
  }
};

export { createSchoolByForm, getSchooldById, updateSchoolByForm, getSchools };
