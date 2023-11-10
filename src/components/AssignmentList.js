import React from "react";
import _ from "lodash";
import { sortBy } from "lodash/fp";

const sortByRound = sortBy(["round"]);

const AssignmentList = ({ rounds }) => {
  if (!rounds.length) return;

  const lastRound = _.last(sortByRound(rounds));
  const assignments = lastRound.assignments;

  const filteredAssignments = assignments.sort((a, b) =>
    a.student.localeCompare(b.student)
  );

  return (
    <div>
      <div className="round-title-container">
        <div className="round-title">Round {lastRound.round}</div>
        <div className="round-date">{lastRound.date}</div>
      </div>
      <div className="list-div">
        {filteredAssignments.map((assignment, index) => (
          <div
            className="list-item"
            key={index}
          >{`${assignment.student} got ${assignment.book}`}</div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;
