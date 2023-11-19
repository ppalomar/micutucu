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
  const classroomRounds = rounds?.filter(
    (r) => r?.classroom === selectedClassroom?.id
  );
  const notClassroomRounds = rounds?.filter(
    (r) => r?.classroom !== selectedClassroom?.id
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

  const updateBook = async (documentId, book) => {
    await updateDocFromCollection("books", documentId, book);
    const restOfBooks = books.filter((b) => b.id !== book.id);
    setBooks([...restOfBooks, { documentId, ...book }]);
  };

  const removeStudent = async (documentId, studentId) => {
    // remove any book that could have the student
    const booksOwnedByStudent = classroomBooks.filter(
      (book) => book.owner === studentId
    );
    const booksNotOwnedByStudent = classroomBooks.filter(
      (book) => book.owner !== studentId
    );
    booksOwnedByStudent.forEach(async (book) => {
      await removeBook({
        documentId: book.documentId,
        needRemoveRounds: false,
      });
    });

    // remove remove all the rounds and reset the books
    await removeRounds({ customBooks: booksNotOwnedByStudent });

    const newStudents = classroomStudents.filter(
      (student) => student.id !== studentId
    );
    setStudents([...notClassroomStudents, ...newStudents]);
    await removeDocFromCollection("students", documentId);
  };

  const resetBooks = async ({ booksToReset }) => {
    // Update classroomBooks to be unassigned in db and local state
    const newBooks = booksToReset.map((b) => ({
      ...b,
      assigned: null,
    }));
    setBooks([...notClassroomBooks, ...newBooks]);

    newBooks.forEach(async ({ documentId, ...restProps }) => {
      // We don't want to save in database the documentId
      updateBook(documentId, restProps);
    });
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

  const removeBook = async ({ documentId, needRemoveRounds = true } = {}) => {
    await removeDocFromCollection("books", documentId);
    const newBooks = classroomBooks.filter((b) => b.documentId !== documentId);
    setBooks([...notClassroomBooks, ...newBooks]);

    // remove all the rounds
    if (needRemoveRounds) {
      await removeRounds({ customBooks: newBooks });
    }
  };

  const assignBooksToStudents = () => {
    /*
    i. Crear una lista de libros disponibles para esa semana, inicialmente todos los libros.
      ii. Para cada alumno en la clase:
          1. Si el alumno no ha devuelto su libro de la semana anterior:
               - Eliminar su libro del historial de asignaciones.
          2. Si el libro asignado al alumno está disponible:
               - Eliminarlo de la lista de libros disponibles.
      iii. Para cada alumno en la clase:
          1. Asignar un libro de la lista de disponibles que minimice la repetición utilizando el historial de asignaciones.
          2. Actualizar la lista de asignaciones y el historial de asignaciones.
    */

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
    updateBook,
    removeBook,
    assignBooksToStudents,
    removeRounds,
  };

  console.log("Classrooms:", classrooms);
  console.log("Students:", classroomStudents);
  console.log("Books:", classroomBooks);
  console.log("Rounds:", classroomRounds);

  return <Presentational {...presentationalProps} />;
};

export default App;
