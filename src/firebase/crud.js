import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import { downloadURL } from "@/utils/functionsClient";

const createDocument = async (collectionName, data) => {
  try {
    if (collectionName === "profile") {
      const setDocRef = doc(db, collectionName, data?.id);
      await setDoc(setDocRef, { ...data });
      return setDocRef;
    }
    const docRef = await addDoc(collection(db, collectionName), { ...data });
    return docRef;
  } catch (error) {
    return { error };
  }
};

const updateDocument = async (collectionName, id, data) => {
  try {
    const setDocRef = doc(db, collectionName, id);
    const docRef = await updateDoc(setDocRef, { ...data });
    return docRef;
  } catch (error) {
    return { error };
  }
};

const getDocuments = async (collectionName, school, typeQuery) => {
  if (!school) return;
  let q = query(
    collection(db, collectionName),
    where("schoolId", "==", school),
  );
  if (typeQuery === "users") {
    q = query(
      collection(db, collectionName),
      where("schoolId", "==", school),
      where("roles", "array-contains-any", ["user-school", "admin"]),
    );
  }
  const querySnapshot = await getDocs(q);
  const documents = [];
  querySnapshot.forEach((doc) => {
    documents.push({ ...doc.data(), id: doc.id });
  });

  return documents;
};

const getDocumentById = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
};

const getDocumentByField = async (collectionName, field, value) => {
  if (!value) return;
  const q = query(collection(db, collectionName), where(field, "==", value));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return;
  }
  if (collectionName === "profile") {
    const data = querySnapshot.docs[0]?.data();
    if (typeof data?.avatar === "string") {
      const avatar = await downloadURL(data?.avatar);
      data.avatar = avatar;
    }
    return data;
  }

  const documents = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return documents;
};

export {
  createDocument,
  updateDocument,
  getDocuments,
  getDocumentById,
  getDocumentByField,
};
