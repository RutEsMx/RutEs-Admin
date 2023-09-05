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

const generatePassword = () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export { downloadURL, generatePassword, validateEmail };
