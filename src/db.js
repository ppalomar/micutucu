import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore/lite";

import { db } from "./firebase";

export const getCollection = async (collectionName) => {
  try {
    const col = collection(db, collectionName);
    const snapshot = await getDocs(col);
    return snapshot.docs.map((doc) => ({ documentId: doc.id, ...doc.data() }));
  } catch {}
};

export const saveCollection = async (collectionName, item) => {
  try {
    const col = collection(db, collectionName);
    const docRef = await addDoc(col, item);
    return docRef.id;
  } catch {}
};

export const removeDocFromCollection = async (collectionName, documentId) => {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
  } catch {}
};

export const updateDocFromCollection = async (
  collectionName,
  documentId,
  data
) => {
  try {
    const documentRef = doc(db, collectionName, documentId);
    await updateDoc(documentRef, data);
  } catch {}
};
