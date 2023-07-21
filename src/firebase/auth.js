import { auth } from "./client";
import { signInWithEmailAndPassword } from "firebase/auth";

async function signInAuth(email, password) {
  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

async function signOut() {
  let result = null,
    error = null;
  try {
    result = await auth.signOut();
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export { signInAuth, signOut };
