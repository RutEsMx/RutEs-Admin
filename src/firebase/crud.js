import { doc, getDoc, collection, addDoc, updateDoc, getDocs } from "firebase/firestore"
import { db } from "@/firebase/client"

const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), { ...data })
    return docRef
  } catch (error) {
    return { error }
  }
}

const updateDocument = async (collectionName, id, data) => {
  try {
    const docRef = await updateDoc(doc(db, collectionName, id), { ...data })
    return docRef
  } catch (error) {
    return { error }
  }
}

const getDocuments = async (collectionName, school) => {
  // const q = query(collection(db, collectionName), where("school", "==", school));
  const querySnapshot = await getDocs(collection(db, collectionName))
  const documents = []
  querySnapshot.forEach((doc) => {
    documents.push({ ...doc.data(), id: doc.id })
  })
  
  return documents
}

const getDocumentById = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.log("No such document!")
  }
}

export {
  createDocument,
  updateDocument,
  getDocuments,
  getDocumentById,
}