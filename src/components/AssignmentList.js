// src/components/AssignmentList.js
import React from "react";
import { useRound, useStudent, useClassroom } from "../context";
import { useTranslation } from "react-i18next";

const AssignmentList = () => {
  // Get data from context hooks
  const { selectedRound } = useRound();
  const { getClassroomStudents } = useStudent();
  const { selectedClassroom } = useClassroom();
  const { t } = useTranslation();

  // If no round is selected, don't render anything
  if (!selectedRound) return null;

  const assignments = selectedRound?.assignments || [];
  const classroomStudents = selectedClassroom
    ? getClassroomStudents(selectedClassroom.id)
    : [];

  // Sort assignments by student name
  const filteredAssignments = assignments.sort((a, b) =>
    a.student.name.localeCompare(b.student.name)
  );

  // Find students without books assigned in this round
  const studentsWithoutBook = classroomStudents.filter(
    (s) => !assignments.map((a) => a?.student?.id).includes(s.id)
  );

  return (
    <div className="list-div">
      {filteredAssignments.map((assignment, index) => (
        <div className="list-item assignment" key={index}>
          <span className="material-symbols-rounded">assignment_ind</span>
          {assignment.student.name}
          <span className="material-symbols-rounded">chevron_right</span>
          {assignment.book.name}
        </div>
      ))}
      {studentsWithoutBook.map((student) => (
        <div className="list-item assignment not-returned" key={student.id}>
          <span className="material-symbols-rounded">info</span>
          {t('assignment.notAllowedToReceiveBook', { studentName: student.name })}
        </div>
      ))}
    </div>
  );
};

export default React.memo(AssignmentList);
