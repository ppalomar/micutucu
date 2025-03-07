// src/context/RoundContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { maxBy } from "lodash";
import {
  getCollection,
  saveCollection,
  removeDocFromCollection,
  handleFirebaseError,
} from "../services/db";
import { useBook } from "./BookContext";
import { useClassroom } from "./ClassroomContext";

// Create the context
const RoundContext = createContext();

// Provider component
export const RoundProvider = ({ children }) => {
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { resetBooks } = useBook();
  const { selectedClassroom } = useClassroom();

  // Fetch all rounds from Firestore
  const fetchRounds = async () => {
    setLoading(true);
    try {
      const roundsSnapshot = await getCollection("rounds");
      setRounds(roundsSnapshot);
      setError(null);
    } catch (err) {
      console.error("Error fetching rounds:", err);
      setError(handleFirebaseError(err).message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new round
  const addRound = async (round) => {
    setLoading(true);
    try {
      const documentId = await saveCollection("rounds", round);
      const newRound = { documentId, ...round };
      const updatedRounds = [...rounds, newRound];
      setRounds(updatedRounds);

      // Set the new round as selected
      setSelectedRound(newRound);

      return { success: true, documentId };
    } catch (err) {
      console.error("Error adding round:", err);
      const handledError = handleFirebaseError(err);
      setError(handledError.message);
      return { success: false, error: handledError.message };
    } finally {
      setLoading(false);
    }
  };

  // Remove all rounds for a classroom
  const removeRounds = async (customBooks) => {
    if (!selectedClassroom)
      return { success: false, error: "No classroom selected" };

    const classroomRounds = getClassroomRounds(selectedClassroom.id);
    if (!classroomRounds.length) return { success: true };

    setLoading(true);
    try {
      // Remove all rounds from database
      const promises = classroomRounds.map(async (round) => {
        await removeDocFromCollection("rounds", round.documentId);
      });

      await Promise.all(promises);

      // Update state
      const nonClassroomRounds = rounds.filter(
        (round) => round.classroom !== selectedClassroom.id
      );
      setRounds(nonClassroomRounds);
      setSelectedRound(null);

      // Reset books
      await resetBooks(customBooks);

      return { success: true };
    } catch (err) {
      console.error("Error removing rounds:", err);
      const handledError = handleFirebaseError(err);
      setError(handledError.message);
      return { success: false, error: handledError.message };
    } finally {
      setLoading(false);
    }
  };

  // Get rounds for a specific classroom
  const getClassroomRounds = useCallback(
    (classroomId) => {
      return rounds.filter((round) => round.classroom === classroomId);
    },
    [rounds]
  );

  // Update selected round when classroom changes or rounds update
  useEffect(() => {
    if (selectedClassroom) {
      const classroomRounds = getClassroomRounds(selectedClassroom.id);
      if (classroomRounds.length) {
        const lastRound = maxBy(classroomRounds, "round");
        setSelectedRound(lastRound);
      } else {
        setSelectedRound(null);
      }
    } else {
      setSelectedRound(null);
    }
  }, [selectedClassroom, rounds, getClassroomRounds]);

  // Initial fetch
  useEffect(() => {
    fetchRounds();
  }, []);

  return (
    <RoundContext.Provider
      value={{
        rounds,
        selectedRound,
        setSelectedRound,
        loading,
        error,
        fetchRounds,
        addRound,
        removeRounds,
        getClassroomRounds,
      }}
    >
      {children}
    </RoundContext.Provider>
  );
};

// Custom hook to use the round context
export const useRound = () => {
  const context = useContext(RoundContext);
  if (!context) {
    throw new Error("useRound must be used within a RoundProvider");
  }
  return context;
};
