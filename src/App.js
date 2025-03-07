// src/Presentational.js
import React, { useState } from "react";
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

  // Estado para controlar si la sección de Classroom está contraída
  const [isClassroomCollapsed, setIsClassroomCollapsed] = useState(false);

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

  // Función para alternar el estado de contracción
  const toggleClassroomCollapse = () => {
    setIsClassroomCollapsed(!isClassroomCollapsed);
  };

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
        <div
          className={`section classroom ${
            isClassroomCollapsed ? "collapsed" : ""
          }`}
        >
          <ClassroomForm isCollapsed={isClassroomCollapsed} />

          {!isClassroomCollapsed && (
            <>
              <div className="section-separator" />
              <ClassroomList />
            </>
          )}

          <div
            className="section-toggle"
            onClick={toggleClassroomCollapse}
            title={isClassroomCollapsed ? "Expand" : "Collapse"}
          >
            <span className="material-symbols-rounded">
              {isClassroomCollapsed
                ? "keyboard_double_arrow_right"
                : "keyboard_double_arrow_left"}
            </span>
          </div>
        </div>

        <div className="section students">
          <StudentForm />
          <div className="section-separator" />
          <StudentList />
        </div>
        <div className="section books">
          <BookForm />
          <div className="section-separator" />
          <BookList />
        </div>
        <div className="section rounds">
          <AssignmentHeader isButtonEnabled={isButtonEnabled} />
          <div className="section-separator" />
          <AssignmentList />
        </div>
      </div>
    </div>
  );
};

export default Presentational;
