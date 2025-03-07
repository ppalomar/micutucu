// src/components/AssignmentHeader.js
import React, { useState, useEffect } from "react";
import { useModal, useRound, useClassroom, useAssignment } from "../context";
import RemovePopup from "./RemovePopup";
import GenerateRoundPopup from "./GenerateRoundPopup";

const AssignmentHeader = ({ isButtonEnabled }) => {
  // Get state and functions from context hooks
  const { modal } = useModal();
  const {
    openRemovePopup,
    toggleRemovePopup,
    openGenerateRoundPopup,
    toggleGenerateRoundPopup,
  } = modal;

  const { selectedRound, setSelectedRound, rounds, removeRounds } = useRound();

  const { selectedClassroom } = useClassroom();
  const { assignBooksToStudents } = useAssignment();

  // Local state for tracking if rounds are selected for deletion
  const [selectedRounds, setSelectedRounds] = useState(false);

  // Get classroom rounds - safely with null checks
  const classroomRounds =
    selectedClassroom && rounds
      ? rounds.filter((round) => round.classroom === selectedClassroom.id)
      : [];

  // Reset selectedRounds when popup closes
  useEffect(() => {
    if (!openRemovePopup) {
      setSelectedRounds(false);
    }
  }, [openRemovePopup]);

  // Format the round text for display
  const roundText = selectedRound
    ? `Round ${selectedRound.round} - ${selectedRound.date}`
    : "";

  // Handle delete click for rounds
  const handleDeleteClick = () => {
    setSelectedRounds(true);
    toggleRemovePopup();
  };

  // Handle navigation between rounds
  const handleSelectedRound = (direction) => {
    if (!selectedRound || !classroomRounds.length) return;

    if (direction === "back") {
      const prevRound = classroomRounds.find(
        (r) => r.round === selectedRound.round - 1
      );
      if (prevRound) {
        setSelectedRound(prevRound);
      }
    } else {
      const nextRound = classroomRounds.find(
        (r) => r.round === selectedRound.round + 1
      );
      if (nextRound) {
        setSelectedRound(nextRound);
      }
    }
  };

  // Calculate navigation controls visibility
  const visibleArrows = classroomRounds.length > 1;
  const isEnabledBackArrow = selectedRound?.round > 1;
  const isEnabledForwardArrow = selectedRound?.round < classroomRounds.length;

  // Handle round assignment
  const handleAssignBooks = () => {
    if (selectedClassroom) {
      assignBooksToStudents(selectedClassroom.id);
    }
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>Assignments</h2>
        <h3 className="round-info">
          {visibleArrows && (
            <>
              <div className={!isEnabledBackArrow ? "disabled" : ""}>
                <span
                  onClick={
                    isEnabledBackArrow
                      ? () => handleSelectedRound("back")
                      : () => {}
                  }
                  className="material-symbols-rounded"
                >
                  arrow_back
                </span>
              </div>
              <div className={!isEnabledForwardArrow ? "disabled" : ""}>
                <span
                  onClick={
                    isEnabledForwardArrow
                      ? () => handleSelectedRound("forward")
                      : () => {}
                  }
                  className="material-symbols-rounded"
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
          <button
            disabled={!isButtonEnabled}
            onClick={toggleGenerateRoundPopup}
          >
            Assign Books to Students
          </button>
        </div>
        <div style={{ display: "flex", flex: 1 }} className="delete-round">
          <span
            title="Delete all rounds"
            className="material-symbols-rounded"
            onClick={() => isButtonEnabled && handleDeleteClick()}
          >
            delete
          </span>
        </div>
      </div>
      {selectedRounds && (
        <RemovePopup
          open={openRemovePopup}
          onClose={toggleRemovePopup}
          onRemove={selectedRound ? () => removeRounds() : () => {}}
          message={`Are you sure you want to remove all rounds from ${selectedClassroom?.name}?`}
        />
      )}
      {selectedClassroom && (
        <GenerateRoundPopup
          open={openGenerateRoundPopup}
          onClose={toggleGenerateRoundPopup}
          generateRoundHandler={handleAssignBooks}
          message={`You are gonna create a new round in ${selectedClassroom.name}. Proceed?`}
        />
      )}
    </div>
  );
};

export default React.memo(AssignmentHeader);
