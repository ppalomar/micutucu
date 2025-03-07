// src/Container.js
import React from "react";
import Presentational from "./Presentational";
import {
  useBook,
  useStudent,
  useClassroom,
  useRound,
  useAssignment,
  useModal,
} from "./context";

const Container = () => {
  // Get all state and actions from context hooks
  const {
    books,
    addBook,
    updateBooks,
    removeBook,
    getClassroomBooks,
    resetBooks,
  } = useBook();

  const { students, addStudent, removeStudent, getClassroomStudents } =
    useStudent();

  const {
    classrooms,
    selectedClassroom,
    setSelectedClassroom,
    storeSelectedClassroom,
    addClassroom,
  } = useClassroom();

  const { rounds, selectedRound, setSelectedRound, getClassroomRounds } =
    useRound();

  const { assignBooksToStudents } = useAssignment();

  const { isDevEnvironment } = useModal();

  // Handle classroom selection
  const handleSelectedClassroom = (classroom) => {
    setSelectedClassroom(classroom);
    storeSelectedClassroom(classroom.id);
  };

  // Handle round navigation
  const handleSelectedRound = (direction) => {
    if (!selectedRound || !classroomRounds.length) return;

    if (direction === "back") {
      const prevRound = classroomRounds.find(
        (r) => r.round === selectedRound.round - 1
      );
      if (prevRound) setSelectedRound(prevRound);
    } else {
      const nextRound = classroomRounds.find(
        (r) => r.round === selectedRound.round + 1
      );
      if (nextRound) setSelectedRound(nextRound);
    }
  };

  // Compute derived data
  const classroomStudents = selectedClassroom
    ? getClassroomStudents(selectedClassroom.id)
    : [];

  const classroomBooks = selectedClassroom
    ? getClassroomBooks(selectedClassroom.id)
    : [];

  const classroomRounds = selectedClassroom
    ? getClassroomRounds(selectedClassroom.id)
    : [];

  // Get removeRounds function from useRound
  const { removeRounds: removeAllRounds } = useRound();

  // Remove rounds handler (wrapper for context function)
  const removeRounds = async () => {
    if (!selectedClassroom || !classroomRounds.length) return;

    try {
      await removeAllRounds(classroomBooks);
    } catch (error) {
      console.error("Error removing rounds:", error);
    }
  };

  // Check if the assignment button should be enabled
  const isButtonEnabled =
    classroomStudents.length > 1 && classroomBooks.length > 1;

  // Pass everything to the presentational component
  const presentationalProps = {
    classrooms,
    classroomStudents,
    classroomBooks,
    classroomRounds,
    selectedClassroom,
    selectedRound,
    handleSelectedClassroom,
    handleSelectedRound,
    addClassroom,
    addStudent,
    addBook,
    updateBooks,
    removeStudent,
    removeBook,
    removeRounds,
    assignBooksToStudents: () => assignBooksToStudents(selectedClassroom?.id),
    isButtonEnabled,
    isDevEnvironment,
  };

  return <Presentational {...presentationalProps} />;
};

export default Container;
