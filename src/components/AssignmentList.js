import React from "react";
import _ from "lodash";

const AssignmentList = ({ rounds }) => {
  if (!rounds.length) return;

  const lastRound = _.last(rounds);
  const assignments = lastRound.assignments;

  const filteredAssignments = assignments.sort((a, b) =>
    a.student.localeCompare(b.student)
  );

  return (
    <div className="list-div">
      {filteredAssignments.map((assignment, index) => (
        <div
          className="list-item assignment"
          key={index}
        >{`${assignment.student} got ${assignment.book}`}</div>
      ))}
    </div>
  );
};

export default AssignmentList;
