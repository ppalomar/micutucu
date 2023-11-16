// src/App.js
import React, { useState, useEffect } from "react";

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

  const classroomStudents = React.useMemo(
    () => students?.filter((s) => s.classroomId === selectedClassroom?.id),
    [selectedClassroom?.id, students]
  );

  const notClassroomStudents = React.useMemo(
    () => students?.filter((s) => s.classroomId !== selectedClassroom?.id),
    [selectedClassroom?.id, students]
  );

  const classroomBooks = React.useMemo(
    () => books?.filter((b) => b?.classroomId === selectedClassroom?.id),
    [books, selectedClassroom?.id]
  );

  const notClassroomBooks = React.useMemo(
    () => books?.filter((b) => b?.classroomId !== selectedClassroom?.id),
    [books, selectedClassroom?.id]
  );

  const classroomRounds = React.useMemo(
    () => rounds?.filter((r) => r?.classroom === selectedClassroom?.id),
    [rounds, selectedClassroom?.id]
  );

  const notClassroomRounds = React.useMemo(
    () => rounds?.filter((r) => r?.classroom !== selectedClassroom?.id),
    [rounds, selectedClassroom?.id]
  );

  // HELPERS ------------------------------------------------------------------
  const addClassroom = async (classroom) => {
    const documentId = await saveCollection("classrooms", classroom);
    setBooks([...classrooms, { documentId, ...classroom }]);
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

  const updateBook = (documentId, book) => {
    updateDocFromCollection("books", documentId, book);
  };

  const removeStudent = async (documentId, studentId) => {
    // remove all the rounds
    await removeRounds();

    // remove any book that could have the student
    const booksOwnedByStudent = classroomBooks.filter(
      (book) => book.owner === studentId
    );
    booksOwnedByStudent.forEach(async (book) => {
      await removeBook(book.documentId, false);
    });

    const newStudents = classroomStudents.filter(
      (student) => student.id !== studentId
    );
    setStudents([...notClassroomStudents, ...newStudents]);
    await removeDocFromCollection("students", documentId);
  };

  const removeRounds = async (stateBooks) => {
    // Remove all classroomRounds in db and local state
    classroomRounds.forEach(async (r) => {
      await removeDocFromCollection("rounds", r?.documentId);
    });
    setRounds(notClassroomRounds);

    // Update classroomBooks to be unassigned in db and local state
    const booksToReset = stateBooks || classroomBooks;
    const newBooks = booksToReset.map((b) => ({
      ...b,
      assigned: null,
      prevAssigned: null,
    }));
    newBooks.forEach(async ({ documentId, ...restProps }) => {
      // We don't want to save in database the documentId
      updateBook(documentId, restProps);
    });
    setBooks([...notClassroomBooks, ...newBooks]);
  };

  const removeBook = async (documentId, needRemoveRounds = true) => {
    await removeDocFromCollection("books", documentId);
    const newBooks = classroomBooks.filter((b) => b.documentId !== documentId);
    setBooks([...notClassroomBooks, ...newBooks]);

    // remove all the rounds
    if (needRemoveRounds) {
      await removeRounds(newBooks);
    }
  };

  const assignBooksToStudents = () => {
    const newAssignments = [];

    classroomBooks.forEach((book) => {
      let nextPosition;

      // Calculate the new 'assigned' position
      if (!book.assigned) {
        const owner = classroomStudents.find(
          (student) => student.id === book.owner
        );
        nextPosition = owner?.position + 1;
      } else {
        nextPosition = book.assigned + 1;
      }
      book.assigned =
        nextPosition > classroomStudents.length ? 1 : nextPosition;

      const { documentId, ...restBook } = book;
      updateBook(documentId, restBook);

      newAssignments.push({
        student: classroomStudents.find((s) => s.position === book.assigned)
          ?.name,
        book: book.name,
      });
    });

    addRound({
      round: classroomRounds.length + 1,
      date: getCurrentDateTime(),
      assignments: newAssignments,
      classroom: selectedClassroom.id,
    });
  };

  const handleSelectedClassroom = (classroom) => {
    setSelectedClassroom(classroom);
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
  // END EFFECTS --------------------------------------------------------------

  const presentationalProps = {
    classrooms,
    classroomStudents,
    classroomBooks,
    classroomRounds,
    addClassroom,
    selectedClassroom,
    handleSelectedClassroom,
    addStudent,
    removeStudent,
    addBook,
    removeBook,
    assignBooksToStudents,
    removeRounds,
  };

  return <Presentational {...presentationalProps} />;
};

export default App;
