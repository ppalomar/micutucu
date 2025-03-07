// src/components/NewCoursePopup.js
import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useModal } from "../context";

const NewCoursePopup = ({ onConfirm, message }) => {
  // Get modal state and functions from context
  const { modal } = useModal();
  const { openNewCoursePopup, toggleNewCoursePopup } = modal;

  // Handle cancel button click
  const handleCancel = () => {
    toggleNewCoursePopup();
  };

  // Handle confirm button click
  const handleConfirm = () => {
    // Execute the confirm operation passed by the parent
    if (onConfirm) {
      onConfirm();
    }
    toggleNewCoursePopup();
  };

  return (
    <Modal
      open={openNewCoursePopup}
      onClose={toggleNewCoursePopup}
      aria-labelledby="new-course-popup"
      aria-describedby="popup-to-confirm-new-course-action"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.1)",
      }}
      disableBackdropClick
    >
      <div className="popup new-course-popup">
        <Typography gutterBottom>{message}</Typography>
        <div className="actions-container">
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            style={{ backgroundColor: "#8e44ad" }}
          >
            Start New Course
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NewCoursePopup;
