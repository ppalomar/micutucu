import React from "react";

const AssignmentList = ({ selectedRound, students }) => {
  if (!selectedRound) return;

  const assignments = selectedRound?.assignments || [];

  const filteredAssignments = assignments.sort((a, b) =>
    a.student.name.localeCompare(b.student.name)
  );

  const studentsWithoutBook = students.filter(
    (s) => !assignments.map((a) => a?.student?.id).includes(s.id)
  );

  return (
    <div className="list-div">
      {filteredAssignments.map((assignment, index) => (
        <div className="list-item assignment" key={index}>
          <span class="material-symbols-rounded">assignment_ind</span>
          {`${assignment.student.name} got ${assignment.book.name}`}
        </div>
      ))}
      {studentsWithoutBook.map((student) => (
        <div className="list-item assignment not-returned" key={student.id}>
          <span class="material-symbols-rounded">info</span>
          {`${student.name} is not allowed to receive a book`}
        </div>
      ))}
    </div>
  );
};

export default AssignmentList;
