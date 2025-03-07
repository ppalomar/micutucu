// src/Presentational.js
import React from "react";
import { useClassroom, useStudent, useBook, useModal } from "./context";

import ClassroomForm from "./components/ClassroomForm";
import StudentForm from "./components/StudentForm";
import BookForm from "./components/BookForm";
import ClassroomList from "./components/ClassroomList";
import StudentList from "./components/StudentList";
import BookList from "./components/BookList";
import AssignmentList from "./components/AssignmentList";
import AssignmentHeader from "./components/AssignmentHeader";

const Presentational = () => {
  // Get data and state from context hooks
  const { isDevEnvironment } = useModal();
  const { selectedClassroom } = useClassroom();
  const { getClassroomStudents } = useStudent();
  const { getClassroomBooks } = useBook();

  // Get data for the selected classroom
  const classroomStudents = selectedClassroom
    ? getClassroomStudents(selectedClassroom.id)
    : [];

  const classroomBooks = selectedClassroom
    ? getClassroomBooks(selectedClassroom.id)
    : [];

  // Check if the button should be enabled
  const isButtonEnabled =
    classroomStudents.length > 1 && classroomBooks.length > 1;

  return (
    <div className="container">
      {isDevEnvironment && (
        <div className="dev-environment-header">DEVELOPMENT ENVIRONMENT</div>
      )}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="title">Micu</div>
        <div className="title-second">tucu</div>
      </div>
      <div className="main-section">
        <div className="section classroom">
          {/* ClassroomForm and ClassroomList now get their data from context */}
          <ClassroomForm />
          <div className="section-separator" />
          <ClassroomList />
        </div>
        <div className="section students">
          {/* StudentForm and StudentList now get their data from context */}
          <StudentForm />
          <div className="section-separator" />
          <StudentList />
        </div>
        <div className="section books">
          {/* BookForm and BookList now get their data from context */}
          <BookForm />
          <div className="section-separator" />
          <BookList />
        </div>
        <div className="section rounds">
          {/* Only pass the button enabled state to AssignmentHeader */}
          <AssignmentHeader isButtonEnabled={isButtonEnabled} />
          <div className="section-separator" />
          {/* AssignmentList gets its data from context */}
          <AssignmentList />
        </div>
      </div>
    </div>
  );
};

export default Presentational;
