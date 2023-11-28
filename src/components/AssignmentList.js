import React from "react";

const AssignmentList = ({ selectedRound }) => {
  if (!selectedRound) return;

  const assignments = selectedRound?.assignments || [];

  const filteredAssignments = assignments.sort((a, b) =>
    a.student.name.localeCompare(b.student.name)
  );

  return (
    <div className="list-div">
      {filteredAssignments.map((assignment, index) => (
        <div className="list-item assignment" key={index}>
          <span class="material-symbols-rounded">assignment_ind</span>
          {`${assignment.student.name} got ${assignment.book.name}`}
        </div>
      ))}
    </div>
  );
};

export default AssignmentList;
