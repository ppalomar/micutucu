import React from "react";

import { useApp } from "../context";
import RemovePopup from "./RemovePopup";

const AssignmentHeader = ({
  classroomRounds,
  selectedRound,
  isButtonEnabled,
  assignBooksToStudents,
  removeRounds,
  selectedClassroom,
  handleSelectedRound,
}) => {
  const { modal } = useApp();
  const { open, toggle: toggleRemovePopup } = modal;

  const roundText = selectedRound
    ? `Round ${selectedRound.round} - ${selectedRound.date}`
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

  const visibleArrows = classroomRounds.length > 1;
  const isEnabledBackArrow = selectedRound?.round > 1;
  const isEnabledForwardArrow = selectedRound?.round < classroomRounds.length;

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>Assignments</h2>
        <h3 className="round-info">
          {visibleArrows && (
            <>
              <div className={!isEnabledBackArrow && "disabled"}>
                <span
                  onClick={
                    isEnabledBackArrow
                      ? () => handleSelectedRound("back")
                      : () => {}
                  }
                  class="material-symbols-rounded"
                >
                  arrow_back
                </span>
              </div>
              <div className={!isEnabledForwardArrow && "disabled"}>
                <span
                  onClick={
                    isEnabledForwardArrow
                      ? () => handleSelectedRound("forward")
                      : () => {}
                  }
                  class="material-symbols-rounded"
                >
                  arrow_forward
                </span>
              </div>
            </>
          )}
          {roundText}
        </h3>
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
          onRemove={selectedRound ? () => removeRounds() : () => {}}
          message={`Are you sure you want to remove all rounds from ${selectedClassroom.name}?`}
        />
      )}
    </div>
  );
};

export default React.memo(AssignmentHeader);
