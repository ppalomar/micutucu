// src/components/GenerateRoundPopup.js
import React from "react";
import { useTranslation } from 'react-i18next';
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useModal, useAssignment, useClassroom } from "../context";

const GenerateRoundPopup = () => {
  const { t } = useTranslation();
  // Get state and functions from context hooks
  const { modal } = useModal();
  const { openGenerateRoundPopup, toggleGenerateRoundPopup } = modal;

  const { selectedClassroom } = useClassroom();
  const { assignBooksToStudents } = useAssignment();

  // Handle cancel button click
  const handleCancel = () => {
    toggleGenerateRoundPopup();
  };

  // Handle generate round button click
  const handleGenerateRound = () => {
    if (selectedClassroom) {
      assignBooksToStudents(selectedClassroom.id);
      toggleGenerateRoundPopup();
    }
  };

  // Create the confirmation message
  const message = selectedClassroom
    ? t('round.confirmWithClassroom', { classroom: selectedClassroom.name })
    : t('round.confirmWithoutClassroom');

  return (
    <Modal
      open={openGenerateRoundPopup}
      onClose={toggleGenerateRoundPopup}
      aria-labelledby="generate-round-popup"
      aria-describedby="popup-to-confirm-generate-round-action"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.1)",
      }}
      disableBackdropClick
    >
      <div className="popup generate-round-popup">
        <Typography gutterBottom>{message}</Typography>
        <div className="actions-container">
          <Button variant="outlined" onClick={handleCancel}>
            {t('button.cancel')}
          </Button>
          <Button variant="contained" onClick={handleGenerateRound}>
            {t('round.generate')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GenerateRoundPopup;
