import React from "react";
import _ from "lodash";

const AssignmentList = ({ rounds }) => {
  if (!rounds.length) return;

  const lastRound = _.last(rounds);
  const assignments = lastRound.assignments;

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
