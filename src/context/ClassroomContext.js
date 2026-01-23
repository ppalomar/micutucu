// src/context/ClassroomContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  getCollection,
  saveCollection,
  removeDocFromCollection,
  handleFirebaseError,
} from "../services/db";
import { STORED_SELECTED_CLASSROOM } from "../constants";

// Create the context
const ClassroomContext = createContext();

// Provider component
export const ClassroomProvider = ({ children }) => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all classrooms from Firestore
  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const classroomsSnapshot = await getCollection("classrooms");
      setClassrooms(classroomsSnapshot);
      setError(null);
    } catch (err) {
      console.error("Error fetching classrooms:", err);
      setError(handleFirebaseError(err).message);
    } finally {
      setLoading(false);
    }
  };

  // Store selected classroom in localStorage
  const storeSelectedClassroom = useCallback((classroomId) => {
    localStorage.setItem(STORED_SELECTED_CLASSROOM, classroomId);
  }, []);

  // Custom setSelectedClassroom function that also updates localStorage
  const setSelectedClassroomWithStorage = useCallback(
    (classroom) => {
      setSelectedClassroom(classroom);
      if (classroom?.id) {
        storeSelectedClassroom(classroom.id);
      }
    },
    [storeSelectedClassroom]
  );

  // Add a new classroom
  const addClassroom = async (classroom) => {
    setLoading(true);
    try {
      const documentId = await saveCollection("classrooms", classroom);
      const newClassroom = { documentId, ...classroom };
      setClassrooms([...classrooms, newClassroom]);
      storeSelectedClassroom(classroom.id);
      setSelectedClassroom(newClassroom);
      return { success: true, documentId };
    } catch (err) {
      console.error("Error adding classroom:", err);
      const handledError = handleFirebaseError(err);
      setError(handledError.message);
      return { success: false, error: handledError.message };
    } finally {
      setLoading(false);
    }
  };

  // Remove a classroom
  const removeClassroom = async (documentId) => {
    setLoading(true);
    try {
      await removeDocFromCollection("classrooms", documentId);
      setClassrooms(
        classrooms.filter((classroom) => classroom.documentId !== documentId)
      );
      return { success: true };
    } catch (err) {
      console.error("Error removing classroom:", err);
      const handledError = handleFirebaseError(err);
      setError(handledError.message);
      return { success: false, error: handledError.message };
    } finally {
      setLoading(false);
    }
  };

  // Initialize selected classroom from localStorage or first classroom (alphabetically)
  useEffect(() => {
    if (classrooms.length) {
      const storedClassroomId = localStorage.getItem(STORED_SELECTED_CLASSROOM);
      // Sort for initial selection
      const sorted = [...classrooms].sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      );

      if (storedClassroomId) {
        const storedClassroom = classrooms.find(
          (c) => String(c.id) === String(storedClassroomId)
        );
        if (storedClassroom) {
          setSelectedClassroom(storedClassroom);
        } else {
          // If stored classroom not found, use first sorted classroom
          setSelectedClassroom(sorted[0]);
          storeSelectedClassroom(sorted[0].id);
        }
      } else {
        // If no stored classroom, use first sorted classroom
        setSelectedClassroom(sorted[0]);
        storeSelectedClassroom(sorted[0].id);
      }
    }
  }, [classrooms, storeSelectedClassroom]);

  // Initial fetch
  useEffect(() => {
    fetchClassrooms();
  }, []);

  // Sort classrooms alphabetically by name
  const sortedClassrooms = useMemo(() => {
    return [...classrooms].sort((a, b) =>
      (a.name || '').localeCompare(b.name || '')
    );
  }, [classrooms]);

  return (
    <ClassroomContext.Provider
      value={{
        classrooms: sortedClassrooms,
        selectedClassroom,
        setSelectedClassroom: setSelectedClassroomWithStorage,
        loading,
        error,
        fetchClassrooms,
        addClassroom,
        removeClassroom,
        storeSelectedClassroom,
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};

// Custom hook to use the classroom context
export const useClassroom = () => {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error("useClassroom must be used within a ClassroomProvider");
  }
  return context;
};
