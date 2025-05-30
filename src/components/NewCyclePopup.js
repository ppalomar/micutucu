// src/components/NewCyclePopup.js
import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useModal } from "../context";

const NewCyclePopup = ({ onConfirm, message }) => {
  const { t } = useTranslation();
  // Get modal state and functions from context
  const { modal } = useModal();
  const { openNewCyclePopup, toggleNewCyclePopup } = modal;

  // Handle cancel button click
  const handleCancel = () => {
    toggleNewCyclePopup();
  };

  // Handle confirm button click
  const handleConfirm = () => {
    // Execute the confirm operation passed by the parent
    if (onConfirm) {
      onConfirm();
    }
    toggleNewCyclePopup();
  };

  return (
    <Modal
      open={openNewCyclePopup}
      onClose={toggleNewCyclePopup}
      aria-labelledby="new-cycle-popup"
      aria-describedby="popup-to-confirm-new-cycle-action"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.1)",
      }}
      disableBackdropClick
    >
      <div className="popup new-cycle-popup">
        <Typography gutterBottom>{message}</Typography>
        <div className="actions-container">
          <Button variant="outlined" onClick={handleCancel}>
            {t('button.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            style={{ backgroundColor: "#e74c3c" }}
          >
            {t('book.startNewCycle')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NewCyclePopup;
