// src/context/AssignmentContext.js
import React, { createContext, useContext } from "react";
import { useBook } from "./BookContext";
import { useStudent } from "./StudentContext";
import { useRound } from "./RoundContext";
import { useClassroom } from "./ClassroomContext";
import { getCurrentDateTime } from "../helpers";

// Create the context
const AssignmentContext = createContext();

export const AssignmentProvider = ({ children }) => {
  const { updateBooks, resetBooks, getClassroomBooks } = useBook();
  const { addRound, getClassroomRounds } = useRound();
  const { getClassroomStudents } = useStudent();
  const { getSelectedClassroom } = useClassroom();

  // Assign books to students with improved algorithm
  const assignBooksToStudents = async (classroomId) => {
    // Get required data from other contexts

    const selectedClassroom = getSelectedClassroom();
    const classroomBooks = getClassroomBooks(classroomId);
    const classroomStudents = getClassroomStudents(classroomId);
    const classroomRounds = getClassroomRounds(classroomId);

    // Reset books if we've completed a full cycle
    if (
      classroomRounds.length > 0 &&
      classroomRounds.length % (classroomStudents.length - 1) === 0
    ) {
      await resetBooks(classroomBooks);
    }

    // Get available books and eligible students
    const availableBooks = classroomBooks.filter((b) => b.available);
    const notAvailableBooks = classroomBooks.filter((b) => !b.available);
    const studentIdsThatNotReturnedBook = notAvailableBooks.map(
      (b) => b.assigned
    );
    const studentIdsOwningABook = classroomBooks.map((b) => b.owner);

    // Only consider students who returned their books and own a book
    const studentsConsideredForRound = classroomStudents.filter(
      (s) =>
        !studentIdsThatNotReturnedBook.includes(s.id) &&
        studentIdsOwningABook.includes(s.id)
    );

    // Check for edge cases
    if (studentsConsideredForRound.length === 0) {
      console.warn("No eligible students for this round");
      return { success: false, error: "No eligible students for this round" };
    }

    if (availableBooks.length < studentsConsideredForRound.length) {
      console.warn("Not enough available books for all students");
      return {
        success: false,
        error: "Not enough available books for all students",
      };
    }

    // Build a history matrix of which students have read which books
    const readHistory = buildReadHistoryMatrix(
      studentsConsideredForRound,
      availableBooks,
      classroomRounds
    );

    // Get optimal assignments
    const assignments = getOptimalAssignments(
      studentsConsideredForRound,
      availableBooks,
      readHistory
    );

    // Create and save the new round
    const newRound = {
      round: classroomRounds.length + 1,
      date: getCurrentDateTime(),
      assignments: assignments.map(({ student, book }) => ({ student, book })),
      classroom: selectedClassroom.id,
    };

    await addRound(newRound);

    // Update books with new assignments
    const booksToUpdate = assignments.map(({ student, book }) => ({
      ...book,
      assigned: student.id,
    }));

    await updateBooks(booksToUpdate);

    return { success: true };
  };

  // Helper function to build read history matrix
  const buildReadHistoryMatrix = (students, books, rounds) => {
    // Initialize matrix with zeros
    const history = {};
    students.forEach((student) => {
      history[student.id] = {};
      books.forEach((book) => {
        history[student.id][book.id] = 0;
      });
    });

    // Count previous assignments
    rounds.forEach((round) => {
      round.assignments.forEach((assignment) => {
        const studentId = assignment.student.id;
        const bookId = assignment.book.id;

        if (history[studentId] && history[studentId][bookId] !== undefined) {
          history[studentId][bookId]++;
        }
      });
    });

    return history;
  };

  // Helper function to get optimal assignments
  const getOptimalAssignments = (students, books, readHistory) => {
    // Create a score matrix for each student-book pair
    // Lower score is better (0 = never read, 1 = read once, etc.)
    const scoreMatrix = {};
    students.forEach((student) => {
      scoreMatrix[student.id] = {};
      books.forEach((book) => {
        // Start with read history count
        let score = readHistory[student.id][book.id];

        // Add penalty for own book (very high score)
        if (book.owner === student.id) {
          score += 1000;
        }

        scoreMatrix[student.id][book.id] = score;
      });
    });

    // Sort students by how many books they've read total (fewer first)
    const sortedStudents = [...students].sort((a, b) => {
      const aTotal = Object.values(readHistory[a.id]).reduce(
        (sum, count) => sum + count,
        0
      );
      const bTotal = Object.values(readHistory[b.id]).reduce(
        (sum, count) => sum + count,
        0
      );
      return aTotal - bTotal;
    });

    // Assign books using greedy approach
    const assignments = [];
    const assignedBookIds = new Set();

    sortedStudents.forEach((student) => {
      // Get available books for this student (not yet assigned in this round)
      const availableBooksForStudent = books.filter(
        (book) => !assignedBookIds.has(book.id) && book.owner !== student.id
      );

      if (availableBooksForStudent.length === 0) {
        // If we somehow ran out of books, allow own book as last resort
        const lastResortBooks = books.filter(
          (book) => !assignedBookIds.has(book.id)
        );
        if (lastResortBooks.length > 0) {
          const book = lastResortBooks[0];
          assignments.push({ student, book });
          assignedBookIds.add(book.id);
        }
        return;
      }

      // Find the book with lowest score (least read) for this student
      const bestBook = availableBooksForStudent.reduce((best, current) => {
        return scoreMatrix[student.id][current.id] <
          scoreMatrix[student.id][best.id]
          ? current
          : best;
      }, availableBooksForStudent[0]);

      assignments.push({ student, book: bestBook });
      assignedBookIds.add(bestBook.id);
    });

    // Optimization pass: see if we can swap any assignments to reduce total repeats
    let improved = true;
    const MAX_ITERATIONS = 100;
    let iteration = 0;

    while (improved && iteration < MAX_ITERATIONS) {
      improved = false;
      iteration++;

      // Try all possible swaps between pairs of assignments
      for (let i = 0; i < assignments.length; i++) {
        for (let j = i + 1; j < assignments.length; j++) {
          const studentI = assignments[i].student;
          const studentJ = assignments[j].student;
          const bookI = assignments[i].book;
          const bookJ = assignments[j].book;

          // Calculate current score
          const currentScore =
            scoreMatrix[studentI.id][bookI.id] +
            scoreMatrix[studentJ.id][bookJ.id];

          // Calculate score after hypothetical swap
          const swapScore =
            scoreMatrix[studentI.id][bookJ.id] +
            scoreMatrix[studentJ.id][bookI.id];

          // If swapping would improve the score, do it
          if (swapScore < currentScore) {
            assignments[i].book = bookJ;
            assignments[j].book = bookI;
            improved = true;
            break;
          }
        }
        if (improved) break;
      }
    }

    return assignments;
  };

  return (
    <AssignmentContext.Provider
      value={{
        assignBooksToStudents,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
};

// Custom hook to use the assignment context
export const useAssignment = () => {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error("useAssignment must be used within an AssignmentProvider");
  }
  return context;
};
