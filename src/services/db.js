// src/services/db.js
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore/lite";

import { db } from "./firebase";

/**
 * Fetches all documents from a collection
 * @param {string} collectionName - Name of the collection to fetch
 * @returns {Promise<Array>} - Array of documents with their IDs
 */
export const getCollection = async (collectionName) => {
  try {
    const col = collection(db, collectionName);
    const snapshot = await getDocs(col);
    return snapshot.docs.map((doc) => ({ documentId: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    throw new DatabaseError(`Failed to fetch ${collectionName}`, error);
  }
};

/**
 * Saves a document to a collection
 * @param {string} collectionName - Name of the collection
 * @param {object} item - Document to save
 * @returns {Promise<string>} - ID of the created document
 */
export const saveCollection = async (collectionName, item) => {
  try {
    const col = collection(db, collectionName);
    const docRef = await addDoc(col, item);
    return docRef.id;
  } catch (error) {
    console.error(`Error saving to collection ${collectionName}:`, error);
    throw new DatabaseError(`Failed to save to ${collectionName}`, error);
  }
};

/**
 * Removes a document from a collection
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - ID of the document to remove
 * @returns {Promise<boolean>} - True if successful
 */
export const removeDocFromCollection = async (collectionName, documentId) => {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
    return true;
  } catch (error) {
    console.error(`Error removing document from ${collectionName}:`, error);
    throw new DatabaseError(`Failed to remove from ${collectionName}`, error);
  }
};

/**
 * Updates a document in a collection
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - ID of the document to update
 * @param {object} data - New data to update
 * @returns {Promise<boolean>} - True if successful
 */
export const updateDocFromCollection = async (
  collectionName,
  documentId,
  data
) => {
  try {
    const documentRef = doc(db, collectionName, documentId);
    await updateDoc(documentRef, data);
    return true;
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw new DatabaseError(`Failed to update in ${collectionName}`, error);
  }
};

/**
 * Custom error class for database operations
 */
class DatabaseError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = "DatabaseError";
    this.originalError = originalError;
    this.code = originalError?.code || "unknown";
  }
}

/**
 * Handles Firebase errors and returns user-friendly messages
 * @param {Error} error - The error to handle
 * @returns {object} - Object with error details
 */
export const handleFirebaseError = (error) => {
  // Map Firebase error codes to user-friendly messages
  const errorMessages = {
    "permission-denied": "You do not have permission to perform this action.",
    "not-found": "The requested resource was not found.",
    "already-exists": "This item already exists.",
    cancelled: "The operation was cancelled.",
    unknown: "An unknown error occurred. Please try again.",
    "invalid-argument": "Invalid data provided. Please check your inputs.",
    "deadline-exceeded": "The operation timed out. Please try again.",
    "resource-exhausted": "Too many requests. Please try again later.",
    "failed-precondition": "Operation failed. Please try again.",
    aborted: "The operation was aborted.",
    "out-of-range": "Operation out of range.",
    unimplemented: "This feature is not implemented.",
    internal: "An internal error occurred. Please try again.",
    unavailable: "Service unavailable. Please check your connection.",
    "data-loss": "Data loss occurred. Please contact support.",
    unauthenticated: "You are not authenticated. Please log in.",
  };

  // Extract the error code or use 'unknown'
  const code =
    error instanceof DatabaseError
      ? error.code
      : error.code
      ? error.code.split("/")[1]
      : "unknown";

  // Get the appropriate message
  const message = errorMessages[code] || error.message || "An error occurred";

  return {
    message,
    original: error instanceof DatabaseError ? error.originalError : error,
    code,
  };
};
