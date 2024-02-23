import React from "react";

import ClassroomForm from "./components/ClassroomForm";
import StudentForm from "./components/StudentForm";
import BookForm from "./components/BookForm";
import ClassroomList from "./components/ClassroomList";
import StudentList from "./components/StudentList";
import BookList from "./components/BookList";
import AssignmentList from "./components/AssignmentList"; // Import the new component
import AssignmentHeader from "./components/AssignmentHeader";

const Presentational = ({
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
  updateBooks,
  removeBook,

  assignBooksToStudents,
  removeRounds,
  selectedRound,
  handleSelectedRound,

  isDevEnvironment,
}) => {
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
          <StudentList
            students={classroomStudents}
            removeStudent={removeStudent}
            selectedClassroom={selectedClassroom}
          />
        </div>
        <div className="section books">
          <BookForm
            students={classroomStudents}
            selectedClassroom={selectedClassroom}
            addBook={addBook}
          />
          <div className="section-separator" />
          <BookList
            books={classroomBooks}
            // students={classroomStudents}
            updateBooks={updateBooks}
            removeBook={removeBook}
            selectedClassroom={selectedClassroom}
          />
        </div>
        <div className="section rounds">
          <AssignmentHeader
            classroomRounds={classroomRounds}
            selectedRound={selectedRound}
            isButtonEnabled={isButtonEnabled}
            assignBooksToStudents={assignBooksToStudents}
            removeRounds={removeRounds}
            selectedClassroom={selectedClassroom}
            handleSelectedRound={handleSelectedRound}
          />
          <div className="section-separator" />
          <AssignmentList
            selectedRound={selectedRound}
            students={classroomStudents}
          />
        </div>
      </div>
    </div>
  );
};

export default Presentational;
