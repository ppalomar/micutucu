// src/App.js
import React, { useState, useEffect } from "react";

import ClassroomForm from "./components/ClassroomForm";
import StudentForm from "./components/StudentForm";
import BookForm from "./components/BookForm";
import ClassroomList from "./components/ClassroomList";
import StudentList from "./components/StudentList";
import BookList from "./components/BookList";
import AssignmentList from "./components/AssignmentList"; // Import the new component
import { getCurrentDateTime } from "./helpers";
import {
  saveCollection,
  updateDocFromCollection,
  getCollection,
  removeDocFromCollection,
} from "./db";

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

  const isButtonDisabled =
    classroomStudents.length === 0 || classroomBooks.length === 0;

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

  // HELPERS ------------------------------------------------------------------
  const addClassroom = (classroom) => {
    setClassrooms([...classrooms, classroom]);
    saveCollection("classrooms", classroom);
  };

  const addStudent = (student) => {
    setStudents([...students, student]);
    saveCollection("students", student);
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

  const removeRounds = async () => {
    // Remove all classroomRounds in db and local state
    classroomRounds.forEach(async (r) => {
      await removeDocFromCollection("rounds", r?.documentId);
    });
    setRounds(notClassroomRounds);

    // Update classroomBooks to be unassigned in db and local state
    const newBooks = classroomBooks.map((b) => ({
      ...b,
      assigned: null,
      prevAssigned: null,
    }));
    newBooks.forEach(async ({ documentId, ...restProps }) => {
      updateBook(documentId, restProps);
    });
    setBooks([...notClassroomBooks, ...newBooks]);
  };

  const assignBooksToStudents = () => {
    const newAssignments = [];

    classroomBooks.forEach((book) => {
      // Update the book's 'prevAssigned' prop
      book.prevAssigned = book.assigned;

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
  //END HELPERS ---------------------------------------------------------------

  const handleSelectedClassroom = (classroom) => {
    setSelectedClassroom(classroom);
  };

  return (
    <div className="container">
      <div className="title">Micutucu</div>
      <div className="main-section">
        <div className="section classroom">
          <ClassroomForm addClassroom={addClassroom} />
          <div className="section-separator" />
          <ClassroomList
            classrooms={classrooms}
            selectedClassroom={selectedClassroom}
            handleSelectedClassroom={handleSelectedClassroom}
          />
        </div>
        <div className="section students">
          <StudentForm
            students={classroomStudents}
            selectedClassroom={selectedClassroom}
            addStudent={addStudent}
          />
          <div className="section-separator" />
          <StudentList students={classroomStudents} classrooms={classrooms} />
        </div>
        <div className="section books">
          <BookForm
            students={classroomStudents}
            selectedClassroom={selectedClassroom}
            addBook={addBook}
          />
          <div className="section-separator" />
          <BookList books={classroomBooks} students={classroomStudents} />
        </div>
        <div className="section rounds">
          <div style={{ display: "flex" }}>
            <button disabled={isButtonDisabled} onClick={assignBooksToStudents}>
              Assign Books to Students
            </button>
            <div className="delete-round">
              <span class="material-symbols-rounded" onClick={removeRounds}>
                delete
              </span>
            </div>
          </div>
          <div className="section-separator" />
          <AssignmentList rounds={classroomRounds} />
        </div>
      </div>
    </div>
  );
};

export default App;

/* TODO LIST:

- REMOVE BOOKS
- REMOVE STUDENTS
- REMOVE ALL ROUNDS AND RESET BOOKS
- REMOVE CLASSROOMS
- MINIMIZE STUDENTS AND BOOKS
- SORT ALPHABETICALLY STUDENTS

*/
