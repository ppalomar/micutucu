import React from "react";

const AssignmentList = ({ rounds }) => {
  if (!rounds.length) return;

  const lastRound = rounds[rounds.length - 1];
  const assignments = lastRound.assignments;

  const filteredAssignments = assignments.sort((a, b) =>
    a.student.localeCompare(b.student)
  ); // Sort by student name alphabetically

  return (
    <div>
      <h2>
        Round {lastRound.round} {lastRound.date}
      </h2>
      <ul>
        {filteredAssignments.map((assignment, index) => (
          <li key={index}>{`${assignment.student} got ${assignment.book}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;
