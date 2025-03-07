// src/components/GenerateRoundPopup.js
import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useModal, useAssignment, useClassroom } from "../context";

const GenerateRoundPopup = () => {
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
    ? `You are gonna create a new round in ${selectedClassroom.name}. Proceed?`
    : "You are going to create a new round. Proceed?";

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
            Cancel
          </Button>
          <Button variant="contained" onClick={handleGenerateRound}>
            New Round
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GenerateRoundPopup;
