// src/context/StudentContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCollection,
  saveCollection,
  removeDocFromCollection,
  handleFirebaseError,
} from "../services/db";

// Create the context
const StudentContext = createContext();

// Provider component
export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all students from Firestore
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const studentsSnapshot = await getCollection("students");
      setStudents(studentsSnapshot);
      setError(null);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(handleFirebaseError(err).message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new student
  const addStudent = async (student) => {
    setLoading(true);
    try {
      const documentId = await saveCollection("students", student);
      setStudents([...students, { documentId, ...student }]);
      return { success: true, documentId };
    } catch (err) {
      console.error("Error adding student:", err);
      const handledError = handleFirebaseError(err);
      setError(handledError.message);
      return { success: false, error: handledError.message };
    } finally {
      setLoading(false);
    }
  };

  // Remove a student
  const removeStudent = async (documentId, studentId) => {
    setLoading(true);
    try {
      await removeDocFromCollection("students", documentId);
      setStudents(
        students.filter((student) => student.documentId !== documentId)
      );
      return { success: true };
    } catch (err) {
      console.error("Error removing student:", err);
      const handledError = handleFirebaseError(err);
      setError(handledError.message);
      return { success: false, error: handledError.message };
    } finally {
      setLoading(false);
    }
  };

  // Get students for a specific classroom
  const getClassroomStudents = (classroomId) => {
    return students.filter((student) => student.classroomId === classroomId);
  };

  // Remove all students for a classroom
  const removeClassroomStudents = async (classroomId) => {
    if (!classroomId) return { success: false, error: "No classroom selected" };

    const classroomStudents = getClassroomStudents(classroomId);
    if (!classroomStudents.length) return { success: true };

    setLoading(true);
    try {
      // Remove all students from database
      const promises = classroomStudents.map(async (student) => {
        await removeDocFromCollection("students", student.documentId);
      });

      await Promise.all(promises);

      // Update state
      setStudents(
        students.filter((student) => student.classroomId !== classroomId)
      );

      return { success: true };
    } catch (err) {
      console.error("Error removing classroom students:", err);
      const handledError = handleFirebaseError(err);
      setError(handledError.message);
      return { success: false, error: handledError.message };
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <StudentContext.Provider
      value={{
        students,
        loading,
        error,
        fetchStudents,
        addStudent,
        removeStudent,
        getClassroomStudents,
        removeClassroomStudents,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

// Custom hook to use the student context
export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
};
