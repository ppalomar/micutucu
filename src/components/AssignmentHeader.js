import React from "react";
import _ from "lodash";
import { sortBy } from "lodash/fp";

import { useApp } from "../context";
import RemovePopup from "./RemovePopup";

const sortByRound = sortBy(["round"]);

const AssignmentHeader = ({
  classroomRounds,
  isButtonEnabled,
  assignBooksToStudents,
  removeRounds,
}) => {
  const { modal } = useApp();
  const { open, toggle: toggleRemovePopup } = modal;

  const lastRound = _.last(sortByRound(classroomRounds));
  const lastRoundText = classroomRounds.length
    ? `Round ${lastRound.round} - ${lastRound.date}`
    : "";

  const handleDeleteClick = () => {
    setSelectedRounds(true);
    toggleRemovePopup();
  };

  const [selectedRounds, setSelectedRounds] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setSelectedRounds(false);
    }
  }, [open]);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>Assignments</h2>
        <h3>{lastRoundText}</h3>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 3 }}>
          <button disabled={!isButtonEnabled} onClick={assignBooksToStudents}>
            Assign Books to Students
          </button>
        </div>
        <div style={{ display: "flex", flex: 1 }} className="delete-round">
          <span
            title="Delete all rounds"
            class="material-symbols-rounded"
            onClick={() => isButtonEnabled && handleDeleteClick()}
          >
            delete
          </span>
        </div>
      </div>
      {selectedRounds && (
        <RemovePopup
          open={open}
          onClose={toggleRemovePopup}
          onRemove={classroomRounds?.length ? () => removeRounds() : () => {}}
          message={`Are you sure you want to remove all the rounds?`}
        />
      )}
    </div>
  );
};

export default AssignmentHeader;
