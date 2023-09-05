import { generatePassword, validateEmail } from "@/utils/functionsClient";
import { signInAuth } from "@/firebase/auth";
import { getCookies } from "./CookiesServices";

const signUp = async (email) => {
  const password = generatePassword();

  try {
    if (validateEmail(email)) {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (response.ok) {
        data.result.password = password;
        return data;
      }
      if (data.error) {
        throw new Error(data.error);
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

const signIn = async (email, password) => {
  try {
    const { result, error } = await signInAuth(email, password);
    if (error) throw new Error(error);
    const jwt = await result?.user?.getIdToken();
    await getCookies(jwt);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export { signUp, signIn };
