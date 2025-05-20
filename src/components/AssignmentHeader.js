// src/components/AssignmentHeader.js
import React from "react";
import { useTranslation } from "react-i18next";
import { useModal, useRound, useClassroom, useAssignment } from "../context";
import GenerateRoundPopup from "./GenerateRoundPopup";

const AssignmentHeader = ({ isButtonEnabled }) => {
  // Get state and functions from context hooks
  const { modal } = useModal();
  const { openGenerateRoundPopup, toggleGenerateRoundPopup } = modal;

  const { selectedRound, setSelectedRound, rounds } = useRound();

  const { selectedClassroom } = useClassroom();
  const { assignBooksToStudents } = useAssignment();

  // Get classroom rounds - safely with null checks
  const classroomRounds =
    selectedClassroom && rounds
      ? rounds.filter((round) => round.classroom === selectedClassroom.id)
      : [];

  const { t } = useTranslation();
  
  // Format the round text for display
  const roundText = selectedRound
    ? t('assignment.roundInfo', { roundNumber: selectedRound.round, date: selectedRound.date })
    : "";

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
        <h2>{t('assignment.title')}</h2>
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
          <div style={{ marginTop: 3 }}>{roundText}</div>
        </h3>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <button
            disabled={!isButtonEnabled}
            onClick={toggleGenerateRoundPopup}
          >
            {t('assignment.assignBooks')}
          </button>
        </div>
      </div>
      {selectedClassroom && (
        <GenerateRoundPopup
          open={openGenerateRoundPopup}
          onClose={toggleGenerateRoundPopup}
          generateRoundHandler={handleAssignBooks}
          message={t('assignment.newRoundConfirmation', { classroomName: selectedClassroom.name })}
        />
      )}
    </div>
  );
};

export default React.memo(AssignmentHeader);
