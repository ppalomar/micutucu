// src/components/StudentList.js
import React, { useState, useEffect, useCallback } from "react";
import { useModal, useStudent, useBook, useClassroom } from "../context";
import RemovePopup from "./RemovePopup";

const StudentList = () => {
  // Get state and functions from context hooks
  const { modal } = useModal();
  const { openRemovePopup, toggleRemovePopup } = modal;

  const { removeStudent, getClassroomStudents } = useStudent();
  const { getClassroomBooks } = useBook();
  const { selectedClassroom } = useClassroom();

  // Local state for the student selected for removal
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Get students and books for the selected classroom
  const classroomStudents = selectedClassroom
    ? getClassroomStudents(selectedClassroom.id)
    : [];

  const classroomBooks = selectedClassroom
    ? getClassroomBooks(selectedClassroom.id)
    : [];

  // Sort students by name
  const sortedStudents = classroomStudents.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Handle delete button click
  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    toggleRemovePopup();
  };

  // Clear selected student when popup closes
  useEffect(() => {
    if (!openRemovePopup) {
      setSelectedStudent(null);
    }
  }, [openRemovePopup]);

  // Check if a student has provided a book
  const getStudentNotOwner = useCallback(
    (studentId) => {
      return classroomBooks.filter((b) => b.owner === studentId)?.length === 0;
    },
    [classroomBooks]
  );

  // Handle student removal
  const handleRemoveStudent = () => {
    if (selectedStudent) {
      removeStudent(selectedStudent.documentId, selectedStudent.id);
    }
  };

  return (
    <div className="list-div">
      {sortedStudents.map((student) => {
        const studentNotOwner = getStudentNotOwner(student.id);

        return (
          <div
            className={`list-item student ${studentNotOwner && "error"}`}
            key={student.id}
          >
            <span className="material-symbols-rounded">person</span>
            <div>{student.name}</div>
            {studentNotOwner && (
              <div className="student-not-owner">Book not provided</div>
            )}
            <div className="list-item-delete">
              <span
                title="Delete student"
                className="material-symbols-rounded"
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
          onRemove={handleRemoveStudent}
          message={`Are you sure you want to remove ${selectedStudent.name} and the owned book from ${selectedClassroom?.name}?`}
        />
      )}
    </div>
  );
};

export default React.memo(StudentList);
