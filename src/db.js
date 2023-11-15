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
  const col = collection(db, collectionName);
  const snapshot = await getDocs(col);
  return snapshot.docs.map((doc) => ({ documentId: doc.id, ...doc.data() }));
};

export const saveCollection = async (collectionName, item) => {
  const col = collection(db, collectionName);
  const docRef = await addDoc(col, item);
  return docRef.id;
};

export const removeDocFromCollection = async (collectionName, documentId) => {
  await deleteDoc(doc(db, collectionName, documentId));
};

export const updateDocFromCollection = async (
  collectionName,
  documentId,
  data
) => {
  const documentRef = doc(db, collectionName, documentId);
  await updateDoc(documentRef, data);
};
