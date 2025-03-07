// src/App.js
import React, { useState, useEffect } from "react";
import { maxBy } from "lodash";

import { getCurrentDateTime } from "./helpers";
import {
  saveCollection,
  updateDocFromCollection,
  getCollection,
  removeDocFromCollection,
} from "./db";
import { useApp } from "./hooks";
import Presentational from "./Presentational";
import { useAppContext } from "./context";

const App = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);

  const { storeSelectedClassroom } = useApp({
    classrooms,
    setSelectedClassroom,
  });

  const { isDevEnvironment } = useAppContext();

  const classroomStudents = students?.filter(
    (s) => s.classroomId === selectedClassroom?.id
  );
  const notClassroomStudents = students?.filter(
    (s) => s.classroomId !== selectedClassroom?.id
  );
  const classroomBooks = books?.filter(
    (b) => b?.classroomId === selectedClassroom?.id
  );
  const notClassroomBooks = books?.filter(
    (b) => b?.classroomId !== selectedClassroom?.id
  );
  const classroomRounds = React.useMemo(
    () => rounds?.filter((r) => r?.classroom === selectedClassroom?.id),
    [rounds, selectedClassroom?.id]
  );
  const notClassroomRounds = rounds?.filter(
    (r) => r?.classroom !== selectedClassroom?.id
  );

  // HELPERS ------------------------------------------------------------------
  const addClassroom = async (classroom) => {
    const documentId = await saveCollection("classrooms", classroom);
    setClassrooms([...classrooms, { documentId, ...classroom }]);
    storeSelectedClassroom(classroom.id);
  };

  const addStudent = async (student) => {
    const documentId = await saveCollection("students", student);
    setStudents([...students, { documentId, ...student }]);
  };

  const addBook = async (book) => {
    const documentId = await saveCollection("books", book);
    setBooks([...books, { documentId, ...book }]);
  };

  const addRound = async (round) => {
    const documentId = await saveCollection("rounds", round);
    setRounds([...rounds, { documentId, ...round }]);
  };

  const updateBooks = (booksToUpdate) => {
    booksToUpdate.forEach(async (book) => {
      // We don't want to save in database the documentId
      const { documentId, ...b } = book;
      await updateDocFromCollection("books", documentId, b);
    });
    const updateIds = booksToUpdate.map((b) => b.id);
    const restOfBooks = books.filter((b) => !updateIds.includes(b.id));
    setBooks([...restOfBooks, ...booksToUpdate]);
  };

  const removeStudent = async (documentId, studentId) => {
    // remove any book that could have the student
    const booksOwnedByStudent = classroomBooks.filter(
      (book) => book.owner === studentId
    );
    booksOwnedByStudent.forEach(async (book) => {
      await removeBook({
        documentId: book.documentId,
      });
    });

    const newStudents = classroomStudents.filter(
      (student) => student.id !== studentId
    );
    setStudents([...notClassroomStudents, ...newStudents]);
    await removeDocFromCollection("students", documentId);
  };

  const removeBook = async ({ documentId } = {}) => {
    await removeDocFromCollection("books", documentId);
    const newBooks = classroomBooks.filter((b) => b.documentId !== documentId);
    setBooks([...notClassroomBooks, ...newBooks]);
  };

  const resetBooks = async ({ booksToReset } = {}) => {
    // Update books to be unassigned in db and local state
    const newBooks = booksToReset?.map((b) => ({
      ...b,
      assigned: null,
    }));

    updateBooks(newBooks);
  };

  const removeRounds = async ({ customBooks } = {}) => {
    if (!classroomRounds.length) return;

    // Remove all classroom rounds in db and local state
    setRounds(notClassroomRounds);
    classroomRounds.forEach(async (r) => {
      await removeDocFromCollection("rounds", r?.documentId);
    });

    // set all the classroom books to un-assigned again to start cycle
    resetBooks({ booksToReset: customBooks || classroomBooks });
  };

  const assignBooksToStudents = async () => {
    // Check if we need to reset the cycle
    if (
      classroomRounds.length > 0 &&
      classroomRounds.length % (classroomStudents.length - 1) === 0
    ) {
      resetBooks({ booksToReset: classroomBooks });
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

    // If no eligible students or not enough books, handle accordingly
    if (studentsConsideredForRound.length === 0) {
      console.warn("No eligible students for this round");
      return;
    }

    if (availableBooks.length < studentsConsideredForRound.length) {
      console.warn("Not enough available books for all students");
      return;
    }

    // Build history matrix - how many times each student has read each book
    const readHistory = buildReadHistoryMatrix(
      studentsConsideredForRound,
      availableBooks,
      classroomRounds
    );

    // Get optimal assignments using the improved algorithm
    const assignments = getOptimalAssignments(
      studentsConsideredForRound,
      availableBooks,
      readHistory
    );

    // Create the new round
    const newRound = {
      round: classroomRounds.length + 1,
      date: getCurrentDateTime(),
      assignments: assignments.map(({ student, book }) => ({ student, book })),
      classroom: selectedClassroom.id,
    };

    // Save the round
    await addRound(newRound);

    // Update books with new assignments
    const booksToUpdate = assignments.map(({ student, book }) => ({
      ...book,
      assigned: student.id,
    }));

    updateBooks(booksToUpdate);
  };

  // Build a matrix showing how many times each student has read each book
  const buildReadHistoryMatrix = (students, books, rounds) => {
    // Initialize the matrix with zeros
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

  // Get optimal assignments using a greedy algorithm with constraints
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

  const handleSelectedClassroom = (classroom) => {
    setSelectedClassroom(classroom);
    storeSelectedClassroom(classroom.id);
  };

  const handleSelectedRound = (direction) => {
    if (direction === "back") {
      setSelectedRound(
        classroomRounds.find((r) => r?.round === selectedRound?.round - 1)
      );
    } else {
      setSelectedRound(
        classroomRounds.find((r) => r?.round === selectedRound?.round + 1)
      );
    }
  };
  //END HELPERS ---------------------------------------------------------------

  // EFFECTS ------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsSnapshot = await getCollection("students");
        const booksSnapshot = await getCollection("books");
        const classroomsSnapshot = await getCollection("classrooms");
        const roundsSnapshot = await getCollection("rounds");

        setStudents(studentsSnapshot);
        setBooks(booksSnapshot);
        setClassrooms(classroomsSnapshot);
        setRounds(roundsSnapshot);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, []);

  // when classroomRounds changes it selects the last one
  useEffect(() => {
    if (classroomRounds.length) {
      const lastRound = maxBy(classroomRounds, "round");
      setSelectedRound(lastRound);
    } else {
      setSelectedRound(null);
    }
  }, [selectedClassroom, classroomRounds]);
  // END EFFECTS --------------------------------------------------------------

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
    assignBooksToStudents,
    isDevEnvironment,
  };

  return <Presentational {...presentationalProps} />;
};

export default App;
