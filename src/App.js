// src/App.js
import React, { useState, useEffect } from "react";
import _ from "lodash";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore/lite";

import ClassroomForm from "./components/ClassroomForm";
import StudentForm from "./components/StudentForm";
import BookForm from "./components/BookForm";
import ClassroomList from "./components/ClassroomList";
import StudentList from "./components/StudentList";
import BookList from "./components/BookList";
import AssignmentList from "./components/AssignmentList"; // Import the new component
import { db } from "./firebase";
import { getCurrentDateTime } from "./helpers";

const App = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [rounds, setRounds] = useState([]);

  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const classroomStudents = students?.filter(
    (s) => s.classroomId === selectedClassroom?.id
  );

  const classroomBooks = books?.filter(
    (b) => b?.classroomId === selectedClassroom?.id
  );

  const classroomRounds = rounds?.filter(
    (r) => r?.classroom === selectedClassroom?.id
  );

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

  const getCollection = async (collectionName) => {
    const col = collection(db, collectionName);
    const snapshot = await getDocs(col);
    return snapshot.docs.map((doc) => doc.data());
  };

  const saveCollection = async (collectionName, item) => {
    const col = collection(db, collectionName);
    const docRef = await addDoc(col, item);
    return docRef.id;
  };

  const removeDocFromCollection = async (collectionName, documentId) => {
    await deleteDoc(doc(db, collectionName, documentId));
  };

  const addClassroom = (classroom) => {
    setClassrooms([...classrooms, classroom]);
    saveCollection("classrooms", classroom);
  };

  const addStudent = (student) => {
    setStudents([...students, student]);
    saveCollection("students", student);
  };

  const addBook = (book) => {
    setBooks([...books, book]);
    saveCollection("books", book);
  };

  const addRound = async (round) => {
    const documentId = await saveCollection("rounds", round);
    setRounds([...rounds, { documentId, ...round }]);
  };

  const removeLastRound = async () => {
    const documentId = _.maxBy(classroomRounds, "round")?.documentId;
    await removeDocFromCollection("rounds", documentId);
    setRounds([...rounds.filter((r) => r.documentId !== documentId)]);

    // reset all the books to the previous state
    setBooks(
      classroomBooks.map((b) => ({
        ...b,
        assigned: b.prevAssigned,
        prevAssigned:
          b.prevAssigned === null
            ? null
            : b.prevAssigned - 1 === 0
            ? classroomStudents.length
            : b.prevAssigned - 1,
      }))
    );
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

  const isButtonDisabled = students.length === 0 || books.length === 0;

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
              <span class="material-symbols-rounded" onClick={removeLastRound}>
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
