import { generatePassword, validateEmail } from "@/utils/functionsClient";
import { signInAuth } from "@/firebase/auth";
import { getCookies } from "./CookiesServices";

const signUp = async (email) => {
  const password = generatePassword();
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
};

const signIn = async (email, password) => {
  const { result, error } = await signInAuth(email, password);
  if (error) throw error;
  const jwt = await result?.user?.getIdToken();
  await getCookies(jwt);
  return result;
};

export { signUp, signIn };
