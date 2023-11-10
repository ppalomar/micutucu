// src/App.js
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    // Load data from Firestore on component mount
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
    await addDoc(col, item);
  };

  const removeDocFromCollection = async (collectionName, document) => {
    await deleteDoc(doc(db, collectionName, document));
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

  const addRound = (round) => {
    setRounds([...rounds, round]);
    saveCollection("rounds", round);
  };

  const removeLastRound = () => {
    removeDocFromCollection("rounds", rounds[rounds.length - 1]);
  };

  const assignBooksToStudents = () => {
    const newAssignments = [];

    books.forEach((book) => {
      // Update the book's 'prevAssigned' prop
      book.prevAssigned = book.assigned;

      let nextPosition;

      // Calculate the new 'assigned' position
      if (!book.assigned) {
        const owner = students.find((student) => student.id === book.owner);
        nextPosition = owner?.position + 1;
      } else {
        nextPosition = book.assigned + 1;
      }
      book.assigned = nextPosition > students.length ? 1 : nextPosition;

      // Create a new assignment
      newAssignments.push({
        student: students[book.assigned - 1].name,
        book: book.name,
      });
    });

    addRound({
      round: rounds.length + 1,
      date: getCurrentDateTime(),
      assignments: newAssignments,
      classroom: selectedClassroom.id,
    });
  };

  const styleBlock = { display: "flex", flexDirection: "column", padding: 20 };

  const isButtonDisabled = students.length === 0 || books.length === 0;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1>Micutucu</h1>
      <div style={{ display: "flex" }}>
        <div style={styleBlock}>
          <ClassroomForm addClassroom={addClassroom} />
          <ClassroomList classrooms={classrooms} />
        </div>
        <div style={styleBlock}>
          <StudentForm
            students={students}
            classrooms={classrooms}
            addStudent={addStudent}
          />
          <StudentList students={students} classrooms={classrooms} />
        </div>
        <div style={styleBlock}>
          <BookForm students={students} addBook={addBook} />
          <BookList books={books} students={students} />
        </div>
        <div style={styleBlock}>
          <div>
            <button disabled={isButtonDisabled} onClick={assignBooksToStudents}>
              Assign Books to Students
            </button>
            <button disabled={isButtonDisabled} onClick={removeLastRound}>
              Delete Last Round
            </button>
            <button disabled={isButtonDisabled} onClick={assignBooksToStudents}>
              Delete All Rounds
            </button>
          </div>
          <AssignmentList rounds={rounds} />
        </div>
      </div>
    </div>
  );
};

export default App;
