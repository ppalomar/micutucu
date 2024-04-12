// src/components/StudentList.js
import React, { useState } from "react";
import { useAppContext } from "../context";
import RemovePopup from "./RemovePopup";

const StudentList = ({ students, books, removeStudent, selectedClassroom }) => {
  const { modal } = useAppContext();
  const { openRemovePopup, toggleRemovePopup } = modal;

  const sortedStudents = students.sort((a, b) => a.name.localeCompare(b.name));

  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    toggleRemovePopup();
  };

  React.useEffect(() => {
    if (!openRemovePopup) {
      setSelectedStudent(null);
    }
  }, [openRemovePopup]);

  const getStudentBooks = React.useCallback(
    (studentId) => {
      return books.filter((b) => b.owner === studentId);
    },
    [books]
  );

  return (
    <div className="list-div">
      {sortedStudents.map((student) => {
        const studentBooks = getStudentBooks(student.id);
        const booksCount = studentBooks?.length || 0;

        return (
          <div
            className={`list-item student ${booksCount !== 1 && "error"}`}
            key={student.id}
          >
            <span class="material-symbols-rounded">person</span>
            <div>{student.name}</div>
            <div
              className={`student-books-count ${booksCount !== 1 && "error"}`}
            >
              {booksCount} book{booksCount !== 1 && "s"}
            </div>
            <div className="list-item-delete">
              <span
                title="Delete student"
                class="material-symbols-rounded"
                onClick={() => handleDeleteClick(student)}
              >
                delete
              </span>
            </div>
          </div>
        );
      })}
      {selectedStudent && (
        <RemovePopup
          open={openRemovePopup}
          onClose={toggleRemovePopup}
          onRemove={() =>
            removeStudent(selectedStudent.documentId, selectedStudent.id)
          }
          message={`Are you sure you want to remove ${selectedStudent.name} and the owned book from ${selectedClassroom?.name}?`}
        />
      )}
    </div>
  );
};

export default StudentList;
