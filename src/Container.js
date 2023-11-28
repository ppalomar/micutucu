// src/App.js
import React, { useState, useEffect } from "react";
import { shuffle, sample, minBy, maxBy } from "lodash";

import { getCurrentDateTime } from "./helpers";
import {
  saveCollection,
  updateDocFromCollection,
  getCollection,
  removeDocFromCollection,
} from "./db";

import Presentational from "./Presentational";

const App = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);

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
    if (
      classroomRounds.length > 0 &&
      classroomRounds.length % (classroomStudents.length - 1) === 0
    ) {
      resetBooks({ booksToReset: classroomBooks });
    }

    const availableBooks = classroomBooks.filter((b) => b.available);
    const notAvailableBooks = classroomBooks.filter((b) => !b.available);
    const studentIdsThatNotReturnedBook = notAvailableBooks.map(
      (b) => b.assigned
    );
    const studentIdsOwningABook = classroomBooks.map((b) => b.owner);
    const studentsConsideredForRound = classroomStudents.filter(
      (s) =>
        !studentIdsThatNotReturnedBook.includes(s.id) &&
        studentIdsOwningABook.includes(s.id)
    );

    const buildRound = () => {
      let booksAlreadyAssigned = [];
      let studentsRepeating = 0;
      const newAssignments = [];

      try {
        shuffle(studentsConsideredForRound).forEach((student) => {
          const bookOwnedByStudent = classroomBooks.find(
            (b) => b.owner === student.id
          );
          const previousBooksAssignedToStudent = classroomRounds.reduce(
            (acc, round) => {
              const assignmentToStudent = round.assignments.find(
                (assignment) => assignment.student.id === student.id
              );

              return assignmentToStudent
                ? [...acc, assignmentToStudent.book]
                : acc;
            },
            []
          );

          const getTargetBooks = (customRestrictedIds) => {
            const baseRestictedIds = [
              bookOwnedByStudent.id,
              ...previousBooksAssignedToStudent.map((pb) => pb.id),
              ...booksAlreadyAssigned.map((ba) => ba.id),
            ];
            return availableBooks.filter(
              (b) => !(customRestrictedIds || baseRestictedIds).includes(b.id)
            );
          };

          let targetBooks = getTargetBooks();

          if (!targetBooks.length) {
            const restrictedIds = [
              bookOwnedByStudent.id,
              ...booksAlreadyAssigned.map((ba) => ba.id),
            ];
            targetBooks = getTargetBooks(restrictedIds);
          }

          const book = sample(targetBooks);

          newAssignments.push({
            student,
            book,
          });

          booksAlreadyAssigned = [...booksAlreadyAssigned, book];

          if (
            previousBooksAssignedToStudent.map((pb) => pb.id).includes(book.id)
          ) {
            studentsRepeating++;
          }
        });

        return { assignments: newAssignments, studentsRepeating };
      } catch {}
    };

    const ITERATIONS = 100;
    let assignmentsBag = [];
    for (let index = 1; index <= ITERATIONS; index++) {
      assignmentsBag = [...assignmentsBag, buildRound()];
    }

    const finalAssignments = minBy(
      assignmentsBag,
      "studentsRepeating"
    )?.assignments;

    addRound({
      round: classroomRounds.length + 1,
      date: getCurrentDateTime(),
      assignments: finalAssignments,
      classroom: selectedClassroom.id,
    });

    const booksToUpdate = finalAssignments.map(({ student, book }) => ({
      ...book,
      assigned: student.id,
    }));

    updateBooks(booksToUpdate);
  };

  const handleSelectedClassroom = (classroom) => {
    setSelectedClassroom(classroom);
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

        setSelectedClassroom(classroomsSnapshot?.[0]);
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
  };

  return <Presentational {...presentationalProps} />;
};

export default App;
