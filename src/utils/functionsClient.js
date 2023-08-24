import { getStorage, ref, getDownloadURL } from "firebase/storage";

const downloadURL = async (path) => {
  const storage = getStorage();
  try {
    const fileRef = ref(storage, path);
    return getDownloadURL(fileRef);
  } catch (error) {
    return { error: error?.message, code: error?.code };
  }
};

export { downloadURL };
