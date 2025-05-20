// src/components/RemovePopup.js
import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useModal } from "../context";

const RemovePopup = ({ onRemove, message }) => {
  // Get modal state and functions from context
  const { modal } = useModal();
  const { openRemovePopup, toggleRemovePopup } = modal;

  // Handle cancel button click
  const handleCancel = () => {
    toggleRemovePopup();
  };

  // Handle remove button click
  const handleRemove = () => {
    // Execute the remove operation passed by the parent
    if (onRemove) {
      onRemove();
    }
    toggleRemovePopup();
  };

  return (
    <Modal
      open={openRemovePopup}
      onClose={toggleRemovePopup}
      aria-labelledby="remove-popup"
      aria-describedby="popup-to-confirm-remove-action"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.1)",
      }}
      disableBackdropClick
    >
      <div className="popup remove-popup">
        <Typography gutterBottom>{message}</Typography>
        <div className="actions-container">
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleRemove}>
            Remove
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RemovePopup;
