import { auth, firestore } from "firebase-admin";

const getUSer = async (sessionid) => {
  try {
    const verifyIdToken = await auth().verifyIdToken(sessionid, true);
    const profile = await firestore()
      .collection("profile")
      .doc(verifyIdToken?.uid)
      .get();
    return profile?.data();
  } catch (error) {
    return { error: error?.message, code: error?.code };
  }
};

export { getUSer };
