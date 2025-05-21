// src/components/StudentList.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useModal,
  useStudent,
  useBook,
  useClassroom,
  useRound,
} from "../context";
import RemovePopup from "./RemovePopup";
import NewCoursePopup from "./NewCoursePopup";

const StudentList = () => {
  // Get state and functions from context hooks
  const { modal } = useModal();
  const { openRemovePopup, toggleRemovePopup, toggleNewCoursePopup } = modal;

  const { removeStudent, getClassroomStudents, removeClassroomStudents } =
    useStudent();
  const { getClassroomBooks, removeClassroomBooks } = useBook();
  const { selectedClassroom } = useClassroom();
  const { removeRounds } = useRound();
  const { t } = useTranslation();

  // Local state for the student selected for removal
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Get students and books for the selected classroom
  const classroomStudents = selectedClassroom
    ? getClassroomStudents(selectedClassroom.id)
    : [];

  const classroomBooks = useMemo(
    () => (selectedClassroom ? getClassroomBooks(selectedClassroom.id) : []),
    [getClassroomBooks, selectedClassroom]
  );

  // Sort students by name
  const sortedStudents = classroomStudents.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Handle delete button click
  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    toggleRemovePopup();
  };

  // Handler for starting a new course
  const handleStartNewCourse = async () => {
    if (selectedClassroom) {
      // First remove all rounds
      const roundsResult = await removeRounds();
      if (!roundsResult.success) {
        console.error("Failed to remove rounds:", roundsResult.error);
        return;
      }

      // Then remove all books for the classroom
      const booksResult = await removeClassroomBooks(selectedClassroom.id);
      if (!booksResult.success) {
        console.error("Failed to remove books:", booksResult.error);
        return;
      }

      // Finally remove all students for the classroom
      const studentsResult = await removeClassroomStudents(
        selectedClassroom.id
      );
      if (!studentsResult.success) {
        console.error("Failed to remove students:", studentsResult.error);
      }
    }
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
    <div>
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
                <div className="student-not-owner">{t('student.bookNotProvided')}</div>
              )}
              <div className="list-item-delete">
                <span
                  title={t('student.deleteTitle')}
                  className="material-symbols-rounded"
                  onClick={() => handleDeleteClick(student)}
                >
                  delete
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 20 }}>
        <button
          onClick={toggleNewCoursePopup}
          disabled={!selectedClassroom || sortedStudents.length === 0}
        >
          {t('student.startNewCourse')}
        </button>
      </div>
      {selectedStudent && (
        <RemovePopup
          open={openRemovePopup}
          onClose={toggleRemovePopup}
          onRemove={handleRemoveStudent}
          message={t('student.deleteConfirmation', { studentName: selectedStudent.name, classroomName: selectedClassroom?.name })}
        />
      )}
      {selectedClassroom && (
        <NewCoursePopup
          onConfirm={handleStartNewCourse}
          message={t('student.newCourseConfirmation', { classroomName: selectedClassroom?.name })}
        />
      )}
    </div>
  );
};

export default React.memo(StudentList);
